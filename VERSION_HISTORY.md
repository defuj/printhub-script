# 📜 PrintHub Version History

Complete version history and release notes for PrintHub library.

---

## [v1.3.0] - 2024-10-07

### 🎉 New Features

#### `writeTextMultiColumn()` - Multi-Column Text Printing
- Print text in 3 or more columns for advanced table layouts
- Support for custom or auto-calculated column widths
- Individual alignment per column (left, center, right)
- Bold, underline, and size options
- Smart text truncation with "~" indicator
- Works with 58mm (32 chars) and 80mm (42 chars) paper
- Full Bluetooth and USB support
- Automatic width validation

**Example:**
```javascript
await print.writeTextMultiColumn(
  ["No", "Item", "Qty", "Price"],
  {
    columnWidths: [3, 15, 5, 9],
    align: ["left", "left", "center", "right"],
    bold: true
  }
);
```

### 📚 Documentation
- Added [MULTICOLUMN_GUIDE.md](./MULTICOLUMN_GUIDE.md) - Comprehensive guide
- Added [IMPLEMENTATION_MULTICOLUMN.md](./IMPLEMENTATION_MULTICOLUMN.md) - Implementation details
- Added [RELEASE_NOTES_v1.3.0.md](./RELEASE_NOTES_v1.3.0.md) - Release notes
- Updated README.md with new feature
- Updated USAGE_GUIDE.md with multi-column section
- Updated FEATURE_IDEAS.md (marked as completed)

### 🧪 Testing
- Added test-multicolumn.html - Interactive test page

### 📊 Statistics
- **Lines Added:** ~250 lines of TypeScript
- **New Methods:** 1 public, 3 private helpers
- **Build Size:** 102 KB (unchanged)
- **Zero Breaking Changes**

---

## [v1.2.1] - 2024-10-06

### 🔧 Bug Fixes

#### Barcode Printing Quality Fix
- **Fixed:** Barcode unscannable issue
- Barcode now prints in full width based on paper size
  - 58mm: Up to 380 pixels wide
  - 80mm: Up to 570 pixels wide
- Fixed aspect ratio distortion (no more square boxes)
- Improved rendering quality with dedicated `printBarcodeImage()` method
- Increased default height from 50px to 60px
- Added smart scaling to prevent overflow
- Optimized ESC/POS image commands

### 📚 Documentation
- Updated [BARCODE_STATUS.md](./BARCODE_STATUS.md)
- Updated [RELEASE_v1.2.1.md](./RELEASE_v1.2.1.md)
- Updated README.md with quality improvements

---

## [v1.2.0] - 2024-10-06

### 🎉 New Features

#### `printBarcode()` - Barcode Generation & Printing
- Generate and print barcodes in 9 formats:
  - CODE128, CODE39, EAN13, EAN8, UPC, ITF14, MSI, pharmacode, codabar
- Customizable width, height, and display options
- Perfect for product labels, inventory, invoices, tickets

**Example:**
```javascript
await print.printBarcode("1234567890", {
  format: "CODE128",
  width: 2,
  height: 60,
  displayValue: true,
  align: "center"
});
```

### 📚 Documentation
- Added [BARCODE_STATUS.md](./BARCODE_STATUS.md)
- Comprehensive barcode documentation in README.md
- Usage examples and best practices

---

## [v1.1.0] - 2024-10-05

### 🎉 New Features

#### `printQRCode()` - QR Code Generation & Printing
- Generate and print QR codes for payments, URLs, tracking
- 3 size options: small (100px), medium (200px), large (300px)
- 4 error correction levels: L, M, Q, H
- Perfect for QRIS payments, e-commerce, feedback surveys

**Example:**
```javascript
await print.printQRCode("https://example.com", {
  size: "large",
  align: "center",
  errorCorrection: "M"
});
```

### 🔧 Improvements
- Optimized browser build (reduced bundle size by ~50%)
- Improved browser compatibility for bundling

### 📚 Documentation
- Added [QR_CODE_GUIDE.md](./QR_CODE_GUIDE.md)
- Complete QR code usage examples
- Best practices for payment QR codes

---

## [v1.0.15] - 2024-09-15

### 🎉 New Features
- Added `putImageWithUrl()` - Print images from URL with alignment
- Refactored printing methods for USB and Bluetooth
- Improved error handling
- Added image printing functionality

### 🐛 Bug Fixes
- Fixed minor bugs in image processing

---

## [v1.0.14] - 2024-09-10

### 📚 Documentation
- Updated README.md with better examples
- Improved documentation structure

---

## [v1.0.13] - 2024-09-05

### 🎉 New Features
- Added Node.js support (TypeScript, ES6, CommonJS)
- Changed instance creation pattern

### 🔄 Breaking Changes
- New way to create PrintHub instance
- Check migration guide for details

---

## [v1.0.7] - 2024-08-20

### 🐛 Bug Fixes
- Fixed `writeTextWith2Column()` text overflow issue
- Text longer than 32/42 characters now handled correctly

---

## [v1.0.6] - 2024-08-15

### 🧹 Cleanup
- Removed unused code
- Code optimization

---

## [v1.0.5] - 2024-08-10

### 🔄 Changes
- Updated paper size format from "58mm"/"80mm" to "58"/"80"
- Simplified configuration

---

## [v1.0.4] - 2024-08-05

### 📚 Documentation
- Added USB Printer setup instructions for Windows, Linux, macOS
- Improved troubleshooting guide

---

## [v1.0.3] - 2024-08-01

### 🐛 Bug Fixes
- Fixed USB Printer connection issues
- Improved USB device detection

---

## [v1.0.0] - 2024-07-25

### 🎉 Initial Release

#### Core Features
- Bluetooth thermal printer support
- USB thermal printer support
- Text printing with formatting options
- Two-column text layout
- Dash lines
- Line breaks
- Paper sizes: 58mm and 80mm

#### Text Options
- Bold
- Underline
- Alignment (left, center, right)
- Size (normal, double)

#### Browser Support
- Chrome 61+
- Edge 79+
- Opera 48+
- Samsung Browser 8.0+

---

## 📊 Version Statistics Summary

| Version | Release Date | Type | Major Features |
|---------|-------------|------|----------------|
| v1.3.0 | 2024-10-07 | Feature | Multi-column printing |
| v1.2.1 | 2024-10-06 | Bugfix | Barcode quality fix |
| v1.2.0 | 2024-10-06 | Feature | Barcode printing |
| v1.1.0 | 2024-10-05 | Feature | QR Code printing |
| v1.0.15 | 2024-09-15 | Feature | Image from URL |
| v1.0.13 | 2024-09-05 | Feature | Node.js support |
| v1.0.0 | 2024-07-25 | Release | Initial release |

---

## 🔮 Upcoming Features

See [FEATURE_IDEAS.md](./FEATURE_IDEAS.md) for planned features:

- `cutPaper()` - Auto paper cutting
- `openCashDrawer()` - Cash drawer control
- `printTable()` - Advanced table with borders
- `useTemplate()` - Template system
- And more...

---

## 📝 Notes

### Breaking Changes History
- **v1.0.13:** Changed instance creation method
- **v1.0.5:** Changed paper size format

### Deprecations
- None currently

### Migration Guides
- See individual release notes for migration details

---

**PrintHub** - Making Thermal Printing Easy! 🖨️

For latest updates, visit: https://github.com/defuj/printhub
