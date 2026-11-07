/**
 * Tag parser and scanner utilities for Smart Close Tag
 */

export interface ParsedSlashTag {
  fullMatch: string;
  tagName: string;
  attributes: string;
  isDoubleSlash: boolean;
  isSelfClosing: boolean;
  startIndex: number;
}

export interface MatchingTagResult {
  tagName: string;
}

/**
 * Check if the text before cursor looks like an exclusion context:
 * - URL (http://, https://, ftp://)
 * - File system path (./path/, ../path/, /dir/)
 * - Line comments (// comment, # comment)
 */
export function isExcludedContext(lineText: string, matchIndex: number): boolean {
  const textBeforeMatch = lineText.slice(0, matchIndex);

  // If match is inside a comment on the same line
  const trimmed = textBeforeMatch.trim();
  if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
    return true;
  }

  // Double slash comment preceding match
  if (/\/\/\s*[^'"]*$/.test(textBeforeMatch)) {
    return true;
  }

  // URL pattern: e.g. https://domain.com/ or http://localhost/
  if (/(?:https?|ftp|file):\/\/[^\s]*$/i.test(textBeforeMatch)) {
    return true;
  }

  // File paths: e.g. ./something/ or ../something/
  if (/(?:\.\/|\.\.\/|\/[a-zA-Z0-9_\-]+)\s*$/.test(textBeforeMatch)) {
    return true;
  }

  // Preceded immediately by '<' (e.g. <div/) - handled by other logic
  if (textBeforeMatch.endsWith('<')) {
    return true;
  }

  return false;
}

/**
 * Parse Tag/ or Tag// or Tag attr="val"/ at the end of textBeforeCursor
 */
export function parseSlashTrigger(
  textBeforeCursor: string,
  allowAttributes: boolean,
  selfClosingTags: string[] = []
): ParsedSlashTag | null {
  if (!textBeforeCursor.endsWith('/')) {
    return null;
  }

  // Check if double slash Tag//
  const isDoubleSlash = textBeforeCursor.endsWith('//');
  const targetText = isDoubleSlash ? textBeforeCursor.slice(0, -1) : textBeforeCursor;

  // Regex pattern:
  // Group 1: Tag name (supports namespaces like local:Control, Grid.Row, Custom-Tag, etc.)
  // Group 2 (optional): Attributes if allowAttributes is enabled
  let regex: RegExp;
  if (allowAttributes) {
    regex = /([A-Za-z_][\w\.\:\-]*)(?:(\s+[^/<>]*?))?\/$/;
  } else {
    regex = /([A-Za-z_][\w\.\:\-]*)\/$/;
  }

  const match = regex.exec(targetText);
  if (!match) {
    return null;
  }

  const matchIndex = targetText.lastIndexOf(match[0]);
  if (isExcludedContext(targetText, matchIndex)) {
    return null;
  }

  const tagName = match[1];
  const attributes = (match[2] || '').trim();
  const lowerTag = tagName.toLowerCase();
  const isVoidElement = selfClosingTags.includes(lowerTag);
  const isSelfClosing = isDoubleSlash || isVoidElement;

  return {
    fullMatch: isDoubleSlash ? match[0] + '/' : match[0],
    tagName,
    attributes,
    isDoubleSlash,
    isSelfClosing,
    startIndex: matchIndex
  };
}

/**
 * Check if the text before cursor ends with an open tag that was just closed by '>'
 * e.g. "<div" + ">" -> "div", or "<Button class='primary'" + ">" -> "Button"
 */
export function parseOpenTagOnGreaterSign(
  textBeforeCursor: string,
  selfClosingTags: string[] = []
): string | null {
  // Must end with '>'
  if (!textBeforeCursor.endsWith('>')) {
    return null;
  }

  // Check if it's already a closing tag: </tag>
  if (/<\/[A-Za-z_][\w\.\:\-]*\s*>$/.test(textBeforeCursor)) {
    return null;
  }

  // Check if it's already self-closing: <tag ... />
  if (/\/\s*>$/.test(textBeforeCursor)) {
    return null;
  }

  // Check if it's an HTML comment, DOCTYPE, or XML directive: <!--, <!, <?
  if (/<!--.*-->$/.test(textBeforeCursor) || /<![A-Za-z]/.test(textBeforeCursor) || /<\?/.test(textBeforeCursor)) {
    return null;
  }

  // Match the open tag right before '>'
  // e.g. <div class="test"> or <Button>
  const match = /<([A-Za-z_][\w\.\:\-]*)(?:\s+[^<>]*)?>$/.exec(textBeforeCursor);
  if (!match) {
    return null;
  }

  const tagName = match[1];
  const lowerTag = tagName.toLowerCase();

  // If it's a void tag (img, input, br, hr...), do not auto-close with paired tag
  if (selfClosingTags.includes(lowerTag)) {
    return null;
  }

  return tagName;
}

/**
 * Scan backward in document text to find the nearest unmatched opening tag for '</'
 */
export function findMatchingOpenTag(
  textBeforeCursor: string,
  selfClosingTags: string[] = []
): MatchingTagResult | null {
  // Strip comments, CDATA, DOCTYPE, and processing instructions
  let cleaned = textBeforeCursor
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<\?[\s\S]*?\?>/g, '');

  // Extract all tag tokens in order
  const tagRegex = /<\s*(\/)?\s*([A-Za-z_][\w\.\:\-]*)(?:\s+[^<>]*?)?(\/)?\s*>/g;
  const stack: string[] = [];
  let m: RegExpExecArray | null;

  while ((m = tagRegex.exec(cleaned)) !== null) {
    const isClosing = Boolean(m[1]);
    const tagName = m[2];
    const isSelfClosing = Boolean(m[3]) || selfClosingTags.includes(tagName.toLowerCase());

    if (isSelfClosing) {
      continue;
    }

    if (isClosing) {
      // Find matching tag in stack from top to bottom
      const lastIndex = stack.lastIndexOf(tagName);
      if (lastIndex !== -1) {
        stack.splice(lastIndex, 1);
      }
    } else {
      stack.push(tagName);
    }
  }

  if (stack.length > 0) {
    const lastOpenTag = stack[stack.length - 1];
    return { tagName: lastOpenTag };
  }

  return null;
}
