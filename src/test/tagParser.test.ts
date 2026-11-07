import * as assert from 'assert';
import {
  parseSlashTrigger,
  parseOpenTagOnGreaterSign,
  findMatchingOpenTag,
  isExcludedContext
} from '../utils/tagParser';

const VOID_TAGS = ['br', 'hr', 'img', 'input', 'meta', 'link'];

suite('TagParser Unit Tests', () => {
  suite('parseSlashTrigger', () => {
    test('matches simple tag with slash: div/', () => {
      const res = parseSlashTrigger('div/', true, VOID_TAGS);
      assert.ok(res);
      assert.strictEqual(res!.tagName, 'div');
      assert.strictEqual(res!.attributes, '');
      assert.strictEqual(res!.isSelfClosing, false);
      assert.strictEqual(res!.isDoubleSlash, false);
    });

    test('matches PascalCase and namespaces: local:UserCard/ and Grid.Row/', () => {
      const res1 = parseSlashTrigger('local:UserCard/', true, VOID_TAGS);
      assert.ok(res1);
      assert.strictEqual(res1!.tagName, 'local:UserCard');

      const res2 = parseSlashTrigger('Grid.Row/', true, VOID_TAGS);
      assert.ok(res2);
      assert.strictEqual(res2!.tagName, 'Grid.Row');
    });

    test('matches tag with attributes: button class="btn btn-primary" id="sub"/', () => {
      const res = parseSlashTrigger('button class="btn btn-primary" id="sub"/', true, VOID_TAGS);
      assert.ok(res);
      assert.strictEqual(res!.tagName, 'button');
      assert.strictEqual(res!.attributes, 'class="btn btn-primary" id="sub"');
      assert.strictEqual(res!.isSelfClosing, false);
    });

    test('respects allowAttributes=false', () => {
      const res = parseSlashTrigger('button class="btn"/', false, VOID_TAGS);
      assert.strictEqual(res, null);
    });

    test('matches double slash for self-closing: Component//', () => {
      const res = parseSlashTrigger('Component//', true, VOID_TAGS);
      assert.ok(res);
      assert.strictEqual(res!.tagName, 'Component');
      assert.strictEqual(res!.isDoubleSlash, true);
      assert.strictEqual(res!.isSelfClosing, true);
    });

    test('matches double slash with attributes: Card title="Hero"//', () => {
      const res = parseSlashTrigger('Card title="Hero"//', true, VOID_TAGS);
      assert.ok(res);
      assert.strictEqual(res!.tagName, 'Card');
      assert.strictEqual(res!.attributes, 'title="Hero"');
      assert.strictEqual(res!.isDoubleSlash, true);
      assert.strictEqual(res!.isSelfClosing, true);
    });

    test('identifies void elements as self-closing: img/ and input type="text"/', () => {
      const res1 = parseSlashTrigger('img/', true, VOID_TAGS);
      assert.ok(res1);
      assert.strictEqual(res1!.tagName, 'img');
      assert.strictEqual(res1!.isSelfClosing, true);

      const res2 = parseSlashTrigger('input type="text"/', true, VOID_TAGS);
      assert.ok(res2);
      assert.strictEqual(res2!.tagName, 'input');
      assert.strictEqual(res2!.isSelfClosing, true);
    });

    test('ignores URLs: https://domain.com/path/', () => {
      assert.strictEqual(isExcludedContext('https://domain.com/path/', 19), true);
      const res = parseSlashTrigger('https://domain.com/path/', true, VOID_TAGS);
      assert.strictEqual(res, null);
    });

    test('ignores comments: // div/', () => {
      const res = parseSlashTrigger('// div/', true, VOID_TAGS);
      assert.strictEqual(res, null);
    });

    test('returns null when text does not end with slash', () => {
      const res = parseSlashTrigger('div', true, VOID_TAGS);
      assert.strictEqual(res, null);
    });
  });

  suite('parseOpenTagOnGreaterSign', () => {
    test('detects opening tag: <div class="box">', () => {
      const res = parseOpenTagOnGreaterSign('<div class="box">', VOID_TAGS);
      assert.strictEqual(res, 'div');
    });

    test('detects namespaced tag: <local:CardView id="c1">', () => {
      const res = parseOpenTagOnGreaterSign('<local:CardView id="c1">', VOID_TAGS);
      assert.strictEqual(res, 'local:CardView');
    });

    test('ignores closing tags: </div>', () => {
      const res = parseOpenTagOnGreaterSign('</div>', VOID_TAGS);
      assert.strictEqual(res, null);
    });

    test('ignores self-closing tags: <img /> and <br />', () => {
      const res = parseOpenTagOnGreaterSign('<img />', VOID_TAGS);
      assert.strictEqual(res, null);
    });

    test('ignores void elements without slash: <img> and <input type="text">', () => {
      const res = parseOpenTagOnGreaterSign('<img>', VOID_TAGS);
      assert.strictEqual(res, null);
    });

    test('ignores DOCTYPE and directives: <!DOCTYPE html> and <?xml version="1.0"?>', () => {
      assert.strictEqual(parseOpenTagOnGreaterSign('<!DOCTYPE html>', VOID_TAGS), null);
      assert.strictEqual(parseOpenTagOnGreaterSign('<?xml version="1.0"?>', VOID_TAGS), null);
    });
  });

  suite('findMatchingOpenTag', () => {
    test('finds single unmatched open tag', () => {
      const text = '<div><span>Hello</span>';
      const res = findMatchingOpenTag(text, VOID_TAGS);
      assert.ok(res);
      assert.strictEqual(res!.tagName, 'div');
    });

    test('finds nearest nested open tag in complex structure', () => {
      const text = `
        <Root>
          <Header>
            <Title>Test</Title>
          </Header>
          <Body>
            <Section>
              <Paragraph>Content</Paragraph>
      `;
      const res = findMatchingOpenTag(text, VOID_TAGS);
      assert.ok(res);
      assert.strictEqual(res!.tagName, 'Section');
    });

    test('ignores self-closing and void tags', () => {
      const text = `
        <Container>
          <img src="test.png" />
          <input type="text">
          <br>
      `;
      const res = findMatchingOpenTag(text, VOID_TAGS);
      assert.ok(res);
      assert.strictEqual(res!.tagName, 'Container');
    });

    test('returns null when all tags are closed', () => {
      const text = '<div><p>Hello</p></div>';
      const res = findMatchingOpenTag(text, VOID_TAGS);
      assert.strictEqual(res, null);
    });
  });
});
