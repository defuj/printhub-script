![PrintHub](https://defuj.github.io/printhub/assets/images/printhub.webp)

# PrintHub

[![npm version](https://badge.fury.io/js/printhub.svg)](https://badge.fury.io/js/printhub)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

PrintHub is a JavaScript plugin for printing text using a Bluetooth or USB thermal printer. Demo: [PrintHub Demo](https://defuj.github.io/printhub/)

## Features

1. **Print QR Code** - Generate and print QR codes for payments (QRIS), URLs, tracking, and more. 🆕
2. Print Image from URL with alignment option.
3. Print text with various options like bold, underline, alignment, and text size.
4. Print text in two columns.
5. Print dashed lines.
6. Print line breaks.
7. Supports two paper sizes: "58mm" and "80mm".
8. Supports connecting to Bluetooth thermal printers.
9. Supports connecting to USB thermal printers.
10. Compatible with modern browsers such as Chrome, Firefox, and Edge.
11. Node.js compatible.
12. Supports usage via CDN.
13. Supports usage via NPM.
14. ES6 compatible.

## Installation

### Using NPM

```bash
npm install printhub
```

Import or require PrintHub into your project.

```javascript
import PrintHub from "printhub";
```

or

```javascript
const PrintHub = require("printhub");
```

### Using CDN

```html
<script src="https://cdn.jsdelivr.net/npm/printhub@latest/dist/index.global.js"></script>
```

Or use specific version:

```html
<script src="https://cdn.jsdelivr.net/npm/printhub@1.1.0/dist/index.global.js"></script>
```

## Usage

You can create an instance of PrintHub with or without specifying the desired paper size. Supported paper sizes are "58" and "80". If the paper size is not specified, the default is "58".

### Creating a PrintHub Instance from NPM

1. Creating a PrintHub instance with "80" paper size

   ```javascript
   import PrintHub from "printhub";

   let printer = new PrintHub();
   ```

   or

   ```javascript
   import PrintHub from "printhub";

   let printer = new PrintHub({
     paperSize: "80",
   });
   ```

### Creating a PrintHub Instance from CDN

1. Creating a PrintHub instance with "80" paper size

   ```javascript
   let printer = new PrintHub.init({
     paperSize: "80",
   });
   ```

2. Creating a PrintHub instance with "58" paper size

   ```javascript
   let printer = new PrintHub.init();
   ```

   or you can use the default paper size

   ```javascript
   let printer = new PrintHub.init({
     paperSize: "58",
   });
   ```

### Selecting Printer Type

You can select the type of printer to use. Supported types are `bluetooth` and `usb`. If the printer type is not specified, the default is `bluetooth`.

1. NPM Usage

```javascript
let printer = new PrintHub({
  printerType: "usb",
});
```

2. CDN Usage

```javascript
let printer = new PrintHub.init({
  printerType: "usb",
});
```

### Connecting to Printer and Printing Text

Use the `connectToPrint` method to connect to a Bluetooth printer and print text. You need to provide two callback functions: `onReady` and `onFailed`.

| Callback   | Description                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `onReady`  | Called when the printer connection is successful. You can use the print object passed to this callback to print text. |
| `onFailed` | Called when the printer connection fails. You can use the message parameter to get the error message.                 |

### How to Use PrintHub

1. Connect to the printer and print text.

```javascript
printer.connectToPrint({
  onReady: async (print) => {
    await print.writeText("Hello, World!");
  },
  onFailed: (message) => {
    console.log(message);
  },
});
```

2. Print bold text.

   ```javascript
   printer.connectToPrint({
     onReady: async (print) => {
       await print.writeText("Hello, World!", { bold: true });
     },
     onFailed: (message) => {
       console.log(message);
     },
   });
   ```

3. Print underlined text.

   ```javascript
   printer.connectToPrint({
     onReady: async (print) => {
       await print.writeText("Hello, World!", { underline: true });
     },
     onFailed: (message) => {
       console.log(message);
     },
   });
   ```

4. Print text with alignment.

   ```javascript
   printer.connectToPrint({
     onReady: async (print) => {
       await print.writeText("Hello, World!", { align: "center" });
     },
     onFailed: (message) => {
       console.log(message);
     },
   });
   ```

5. Print text with a specific size.

   ```javascript
   printer.connectToPrint({
     onReady: async (print) => {
       await print.writeText("Hello, World!", { size: "double" });
     },
     onFailed: (message) => {
       console.log(message);
     },
   });
   ```

6. Print text in two columns.

   ```javascript
   printer.connectToPrint({
     onReady: async (print) => {
       await print.writeTextWith2Column("Name", "John Doe");
     },
     onFailed: (message) => {
       console.log(message);
     },
   });
   ```

7. Print dashed lines.

   ```javascript
   printer.connectToPrint({
     onReady: async (print) => {
       await print.writeDashLine();
     },
     onFailed: (message) => {
       console.log(message);
     },
   });
   ```

8. Print line breaks.

   ```javascript
   printer.connectToPrint({
     onReady: async (print) => {
       await print.writeLineBreak();
     },
     onFailed: (message) => {
       console.log(message);
     },
   });
   ```

9. Print text with multiple options.

   ```javascript
   printer.connectToPrint({
     onReady: async (print) => {
       await print.writeText("Hello, World!", {
         bold: true,
         underline: true,
         align: "center",
         size: "double",
       });
     },
     onFailed: (message) => {
       console.log(message);
     },
   });
   ```

10. Print text with multiple options in two columns.

    ```javascript
    printer.connectToPrint({
      onReady: async (print) => {
        await print.writeTextWith2Column("Name", "John Doe", {
          bold: true,
          underline: true,
          align: "center",
          size: "double",
        });
      },
      onFailed: (message) => {
        console.log(message);
      },
    });
    ```

11. Print an image from a URL.

    ```javascript
    printer.connectToPrint({
      onReady: async (print) => {
        await print.putImageWithUrl("https://example.com/image.png", {
          align: "center",
        });
      },
      onFailed: (message) => {
        console.log(message);
      },
    });
    ```

12. **Print QR Code** 🆕

    Print QR codes for payment (QRIS), URLs, tracking numbers, or any data. Perfect for modern receipts!

    ```javascript
    printer.connectToPrint({
      onReady: async (print) => {
        // Simple QR Code
        await print.printQRCode("https://example.com");
        
        // QR Code with options
        await print.printQRCode("https://example.com/payment", {
          size: "large",        // "small", "medium", "large"
          align: "center",      // "left", "center", "right"
          errorCorrection: "M", // "L", "M", "Q", "H"
        });
      },
      onFailed: (message) => {
        console.log(message);
      },
    });
    ```

    **Example: Receipt with QRIS Payment**

    ```javascript
    printer.connectToPrint({
      onReady: async (print) => {
        // Header
        await print.writeText("TOKO SAYA", { 
          align: "center", 
          bold: true, 
          size: "double" 
        });
        await print.writeDashLine();
        
        // Items
        await print.writeTextWith2Column("Nasi Goreng", "Rp 25.000");
        await print.writeTextWith2Column("Es Teh", "Rp 5.000");
        await print.writeDashLine();
        
        // Total
        await print.writeTextWith2Column("TOTAL", "Rp 30.000", { bold: true });
        await print.writeDashLine();
        
        // QR Code for payment
        await print.writeText("SCAN UNTUK BAYAR", { 
          align: "center", 
          bold: true 
        });
        await print.writeLineBreak();
        
        await print.printQRCode(qrisData, {
          size: "large",
          align: "center",
          errorCorrection: "M"
        });
        
        await print.writeLineBreak({ count: 3 });
      },
      onFailed: (message) => {
        console.log(message);
      },
    });
    ```

    **QR Code Sizes:**
    - `small`: 100x100 pixels - Good for URLs and simple data
    - `medium`: 200x200 pixels (default) - Recommended for most use cases
    - `large`: 300x300 pixels - Best for payment QR (QRIS, GoPay, OVO, etc.)

    **Error Correction Levels:**
    - `L`: ~7% recovery - Clean environments
    - `M`: ~15% recovery (default) - Normal use, recommended
    - `Q`: ~25% recovery - Outdoor use
    - `H`: ~30% recovery - Critical data

    For more details, see [QR Code Guide](./QR_CODE_GUIDE.md).

### API

| Method                                        | Description                                                             |
| --------------------------------------------- | ----------------------------------------------------------------------- |
| `writeLineBreak({ count = 1 })`               | Writes a line break.                                                    |
| `writeDashLine()`                             | Writes a dashed line.                                                   |
| `writeTextWith2Column(text1, text2, options)` | Writes text in two columns.                                             |
| `writeText(text, options)`                    | Writes text.                                                            |
| `connectToPrint({ onReady, onFailed })`       | Connects to the printer and calls the `onReady` or `onFailed` callback. |
| `putImageWithUrl(url, options)`               | Prints an image from a URL.                                             |
| `printQRCode(text, options)` 🆕                | Generates and prints a QR code.                                          |

### Options for `printQRCode` Method 🆕

| Option            | Type     | Description                                                    | Default    |
| ----------------- | -------- | -------------------------------------------------------------- | ---------- |
| `size`            | string   | QR Code size: "small" (100px), "medium" (200px), "large" (300px) | `"medium"` |
| `align`           | string   | Alignment: "left", "center", "right"                          | `"center"` |
| `errorCorrection` | string   | Error correction level: "L", "M", "Q", "H"                    | `"M"`      |
| `onFailed`        | function | Callback function when QR code generation fails              | -          |

### Options for `writeText` and `writeTextWith2Column` Methods

| Option      | Description                                                            | Default  |
| ----------- | ---------------------------------------------------------------------- | -------- |
| `bold`      | Specifies whether the text is printed in bold.                         | `false`  |
| `underline` | Specifies whether the text is printed with an underline.               | `false`  |
| `align`     | Specifies text alignment. Supported values: "left", "center", "right". | `left`   |
| `size`      | Specifies the text size. Supported values: "normal", "double".         | `normal` |

## Use Cases

PrintHub is perfect for various business needs:

### 🛒 Retail & E-commerce
- Print receipts with QRIS payment QR codes
- Order tracking QR codes for customers
- Product information and pricing labels
- Inventory management

### 🍽️ Restaurant & F&B
- Kitchen orders and bills
- Table receipts with payment QR (QRIS, GoPay, OVO)
- Customer feedback survey QR codes
- Digital menu QR codes

### 🎫 Events & Ticketing
- E-tickets with QR codes for validation
- Event passes and badges
- Queue management tickets
- Access control

### 🏪 Point of Sale (POS)
- Sales receipts with payment options
- Customer loyalty program QR codes
- Promotional coupons
- Store information and social media QR codes

### 📦 Logistics & Shipping
- Shipping labels with tracking QR codes
- Delivery receipts
- Warehouse management
- Package tracking

## Tips for Best Results

### For QR Codes
- Use **large size** for payment QR codes (QRIS) for easy scanning
- Use **medium size** for URLs and general purpose
- Use **small size** when space is limited
- Always use **center alignment** for better scanning
- For payment QR, use error correction level **M** or **Q**
- Add descriptive text above/below the QR code

### For Images
- Use high contrast images (black & white works best)
- Recommended max size: 120x120 pixels
- Use PNG or JPG format
- Ensure good lighting for best print quality

### For Text Printing
- Use **bold** for important information (totals, headers)
- Use **double size** for emphasis (store name, total amount)
- Use **center alignment** for headers and important messages
- Use **two columns** for item-price pairs
- Add line breaks for better readability

## Requirements for USB Printer

### Windows

1. Install [Zadig](https://zadig.akeo.ie/).
2. Connect the USB Printer to your computer.
3. Open Zadig and select your USB Printer.
4. Install the WinUSB driver for your USB Printer.
5. Done.

### Linux

1. Connect the USB Printer to your computer.
2. Open the terminal and run `lsusb`.
3. Find your USB Printer and note the vendor id and product id.
4. Run `sudo modprobe usblp`.
5. Run `sudo echo "ATTRS{idVendor}=="YOUR_VENDOR_ID", ATTRS{idProduct}=="YOUR_PRODUCT_ID", MODE="0666", GROUP="plugdev" > /etc/udev/rules.d/99-usb-printer.rules`.
6. Run `sudo udevadm control --reload-rules`.
7. Run `sudo udevadm trigger`.
8. Done.

### macOS

1. Connect the USB Printer to your computer.
2. Open the terminal and run `ls /dev/cu.*`.
3. Find your USB Printer and note the device name.
4. Run `sudo chmod
5. Run `sudo chown
6. Done.

## Browser Support

### Desktop

| Browser | Version | Status |
| ------- | ------- | ------ |
| Chrome  | 61      | ✔️     |
| Firefox | No      | ❌     |
| Edge    | 79      | ✔️     |
| Safari  | No      | ❌     |
| Opera   | 48      | ✔️     |

### Mobile

| Browser | Version | Status |
| ------- | ------- | ------ |
| Chrome  | 61      | ✔️     |
| Firefox | No      | ❌     |
| Safari  | No      | ❌     |
| Opera   | 45      | ✔️     |
| Samsung | 8.0     | ✔️     |
| WebView | No      | ❌     |

## Change Log

### v1.1.0 🆕

- **NEW FEATURE**: `printQRCode()` - Generate and print QR codes for payments, URLs, tracking, and more
- Added support for 3 QR code sizes (small, medium, large)
- Added support for 4 error correction levels (L, M, Q, H)
- Perfect for QRIS payment, e-commerce tracking, feedback surveys, and more
- Optimized browser build (reduced bundle size by ~50%)
- Improved browser compatibility for bundling
- Added comprehensive QR Code guide documentation
- See [QR Code Guide](./QR_CODE_GUIDE.md) for complete usage examples

### v1.0.15

- Now supports to print image from URL (`putImageWithUrl`) with alignment option
- Refactor printing methods for USB and Bluetooth
- Improve error handling and add image printing functionality
- Fix minor bugs

### v1.0.14

- Update README.md

### v1.0.13

- Add support for Node.js (typescript, es6, commonjs)
- Change the way to use instance of PrintHub

### v1.0.7

- Fix writeTextWith2Column method if length of text1 + text2 is greater than 32 or 42 characters

### v1.0.6

- Remove unused code

### v1.0.5

- Update paper size from "58mm" and "80mm" to "58" and "80"

### v1.0.4

- Added instructions for USB Printer on Windows, Linux, and macOS

### v1.0.3

- Fixed USB Printer not working

## Documentation

- **[Complete Usage Guide](./USAGE_GUIDE.md)** - Comprehensive guide with examples for all features
- **[QR Code Guide](./QR_CODE_GUIDE.md)** - Detailed guide for QR code printing with real-world examples
- **[Feature Ideas](./FEATURE_IDEAS.md)** - Upcoming features and roadmap

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues or have questions:
- Open an issue on [GitHub Issues](https://github.com/defuj/printhub/issues)
- Check the [documentation](./USAGE_GUIDE.md)
- See examples in the [demo](https://defuj.github.io/printhub/)

## Acknowledgments

- QR Code generation powered by [qrcode](https://github.com/soldair/node-qrcode)
- Built with TypeScript and modern JavaScript

---

**Made with ❤️ by [Dede Fuji Abdul](https://github.com/defuj)**

**Star ⭐ this repository if you find it helpful!**
