# Smart Close Tag

Extension VSCode để tự động hoàn thiện cặp thẻ trong HTML, XML, và XAML.

## Tính năng

- Tự động tạo cặp thẻ đóng mở khi gõ `TagName/` và nhấn Tab
- Hỗ trợ HTML, XML, XAML và AXAML (Avalonia)
- Đặt con trỏ vào giữa cặp thẻ sau khi tạo
- Hỗ trợ các ký tự đặc biệt trong tên thẻ (dấu chấm, hai chấm, gạch ngang)

## Cách sử dụng

1. Mở file HTML, XML, hoặc XAML
2. Gõ tên thẻ theo sau bởi dấu gạch chéo `/`
3. Nhấn phím **Tab**
4. Extension sẽ tự động tạo cặp thẻ và đặt con trỏ ở giữa

### Ví dụ:

**HTML:**
```
Gõ: div/
Nhấn Tab → <div>|</div>
```

**XML:**
```
Gõ: person/
Nhấn Tab → <person>|</person>
```

**XAML:**
```
Gõ: Button/
Nhấn Tab → <Button>|</Button>

Gõ: Grid.Row/
Nhấn Tab → <Grid.Row>|</Grid.Row>
```

## Các file được hỗ trợ

- `.html`, `.htm` - HTML
- `.xml` - XML
- `.xaml`, `.axaml` - XAML (bao gồm Avalonia)

## Yêu cầu

- VSCode phiên bản 1.80.0 trở lên

## Cài đặt

1. Mở VSCode
2. Vào Extensions (Ctrl+Shift+X)
3. Tìm kiếm "Smart Close Tag"
4. Nhấn Install

## Phát triển

Để phát triển extension:

```bash
# Clone repository
git clone https://github.com/NguyenTungSk2004/smart-close-tag

# Cài đặt dependencies
npm install

# Compile
npm run compile

# Chạy test
npm test
```

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request.

## Giấy phép

MIT License
