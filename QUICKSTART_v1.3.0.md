# 🚀 Quick Start Guide - PrintHub v1.3.0

Get started with the new `writeTextMultiColumn()` feature in 5 minutes!

---

## 📦 Installation

### NPM
```bash
npm install printhub@1.3.0
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/printhub@1.3.0/dist/index.global.js"></script>
```

---

## 🎯 Basic Usage

### 1. Create Printer Instance

```javascript
// NPM/ES6
import PrintHub from "printhub";
const printer = new PrintHub({ paperSize: "58" });

// CDN
const printer = new PrintHub.init({ paperSize: "58" });
```

### 2. Your First Multi-Column Print

```javascript
printer.connectToPrint({
  onReady: async (print) => {
    // Print header
    await print.writeTextMultiColumn(
      ["No", "Item", "Qty", "Price"],
      {
        columnWidths: [3, 15, 5, 9],
        align: ["left", "left", "center", "right"],
        bold: true
      }
    );
    
    // Print data
    await print.writeTextMultiColumn(
      ["1", "Nasi Goreng", "2x", "Rp 50.000"],
      {
        columnWidths: [3, 15, 5, 9],
        align: ["left", "left", "center", "right"]
      }
    );
    
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => console.error(message)
});
```

**Output:**
```
No Item            Qty   Price
1  Nasi Goreng     2x   Rp 50.000
```

---

## 📋 Common Patterns

### Pattern 1: Receipt with Table

```javascript
printer.connectToPrint({
  onReady: async (print) => {
    // Store header
    await print.writeText("TOKO SAYA", {
      align: "center",
      bold: true,
      size: "double"
    });
    await print.writeDashLine();
    
    // Table header
    await print.writeTextMultiColumn(
      ["No", "Item", "Qty", "Price"],
      {
        columnWidths: [3, 15, 5, 9],
        align: ["left", "left", "center", "right"],
        bold: true
      }
    );
    await print.writeDashLine();
    
    // Items
    const items = [
      ["1", "Nasi Goreng", "2", "50.000"],
      ["2", "Es Teh", "3", "15.000"],
      ["3", "Ayam Bakar", "1", "35.000"]
    ];
    
    for (const item of items) {
      await print.writeTextMultiColumn(
        item,
        {
          columnWidths: [3, 15, 5, 9],
          align: ["left", "left", "center", "right"]
        }
      );
    }
    
    await print.writeDashLine();
    
    // Total
    await print.writeTextMultiColumn(
      ["", "", "TOTAL:", "100.000"],
      {
        columnWidths: [3, 15, 5, 9],
        align: ["left", "left", "right", "right"],
        bold: true,
        size: "double"
      }
    );
    
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => alert("Failed: " + message)
});
```

### Pattern 2: Auto-Width Columns

```javascript
// Let PrintHub calculate widths automatically
await print.writeTextMultiColumn(
  ["Left", "Center", "Right"],
  { align: ["left", "center", "right"] }
);
// Each column gets 32 ÷ 3 ≈ 10-11 chars (58mm paper)
```

### Pattern 3: 5 Columns (80mm paper)

```javascript
const printer = new PrintHub({ paperSize: "80" });

printer.connectToPrint({
  onReady: async (print) => {
    await print.writeTextMultiColumn(
      ["Code", "Name", "Stock", "Price", "Status"],
      {
        columnWidths: [6, 15, 7, 8, 6],
        align: ["left", "left", "center", "right", "center"],
        bold: true
      }
    );
    
    await print.writeTextMultiColumn(
      ["P001", "Product A", "100", "25.000", "OK"],
      {
        columnWidths: [6, 15, 7, 8, 6],
        align: ["left", "left", "center", "right", "center"]
      }
    );
  },
  onFailed: (message) => console.error(message)
});
```

---

## 💡 Pro Tips

### Tip 1: Use Constants for Widths

```javascript
const WIDTHS = [3, 15, 5, 9];
const ALIGN = ["left", "left", "center", "right"];

// Header
await print.writeTextMultiColumn(
  ["No", "Item", "Qty", "Price"],
  { columnWidths: WIDTHS, align: ALIGN, bold: true }
);

// Data rows - always consistent!
for (const item of items) {
  await print.writeTextMultiColumn(
    item,
    { columnWidths: WIDTHS, align: ALIGN }
  );
}
```

### Tip 2: Width Templates

**For 58mm (32 chars):**
```javascript
// 4 columns - Receipt format
const RECEIPT_4COL = [3, 15, 5, 9];

// 3 columns - Simple list
const SIMPLE_3COL = [10, 11, 11];
```

**For 80mm (42 chars):**
```javascript
// 5 columns - Inventory
const INVENTORY_5COL = [6, 15, 7, 8, 6];

// 4 columns - Wide receipt
const RECEIPT_4COL = [4, 20, 8, 10];
```

### Tip 3: Merged Columns

```javascript
// Use empty strings to merge columns
await print.writeTextMultiColumn(
  ["", "", "Subtotal:", "95.000"],
  {
    columnWidths: [3, 15, 5, 9],
    align: ["left", "left", "right", "right"]
  }
);
```

### Tip 4: Visual Separators

```javascript
await print.writeTextMultiColumn(header, { bold: true });
await print.writeDashLine(); // ← Separator
// ... data rows ...
await print.writeDashLine(); // ← Separator
await print.writeTextMultiColumn(total, { bold: true });
```

---

## ⚙️ Options Reference

```javascript
await print.writeTextMultiColumn(
  columns,        // string[] - Required
  {
    columnWidths: [3, 15, 5, 9],  // number[] - Optional, auto if not set
    align: ["left", "center", "right"], // string[] - Optional, default "left"
    bold: true,                   // boolean - Optional, default false
    underline: true,              // boolean - Optional, default false
    size: "double"                // string - Optional, "normal" or "double"
  }
);
```

---

## 🎨 Real-World Examples

### Restaurant Order

```javascript
await print.writeText("KITCHEN ORDER #123", { align: "center", bold: true });
await print.writeDashLine();

await print.writeTextMultiColumn(
  ["Qty", "Item", "Notes"],
  { columnWidths: [5, 17, 10], align: ["center", "left", "left"], bold: true }
);

await print.writeTextMultiColumn(
  ["2x", "Nasi Goreng", "No spicy"],
  { columnWidths: [5, 17, 10], align: ["center", "left", "left"] }
);

await print.writeTextMultiColumn(
  ["1x", "Es Teh Manis", "Less sugar"],
  { columnWidths: [5, 17, 10], align: ["center", "left", "left"] }
);
```

### Inventory Report

```javascript
await print.writeText("STOCK REPORT", { align: "center", bold: true });
await print.writeDashLine();

await print.writeTextMultiColumn(
  ["Code", "Item", "In", "Out", "Stock"],
  { columnWidths: [5, 12, 5, 5, 5], bold: true }
);

await print.writeTextMultiColumn(
  ["P001", "Widget A", "50", "30", "120"],
  { columnWidths: [5, 12, 5, 5, 5] }
);
```

### Sales Summary

```javascript
await print.writeTextMultiColumn(
  ["Date", "Trans", "Total"],
  { columnWidths: [12, 8, 12], align: ["left", "center", "right"], bold: true }
);

await print.writeTextMultiColumn(
  ["07/10/2024", "45", "1.250.000"],
  { columnWidths: [12, 8, 12], align: ["left", "center", "right"] }
);
```

---

## 🐛 Common Issues

### Issue: Text gets cut off with "~"

**Problem:** Column too narrow for text

**Solution:** Increase column width
```javascript
// ❌ Bad: 10 chars not enough
columnWidths: [3, 10, 5, 9]

// ✅ Good: 15 chars
columnWidths: [3, 15, 5, 9]
```

### Issue: "Total width exceeds paper width"

**Problem:** Sum of widths > 32 (58mm) or 42 (80mm)

**Solution:** Reduce column widths
```javascript
// ❌ Bad: 3+20+10+10 = 43 > 42
columnWidths: [3, 20, 10, 10]

// ✅ Good: 3+15+5+9 = 32
columnWidths: [3, 15, 5, 9]
```

### Issue: Columns don't align

**Problem:** Different widths for header and data

**Solution:** Use same widths for all rows
```javascript
const WIDTHS = [3, 15, 5, 9];

await print.writeTextMultiColumn(header, { columnWidths: WIDTHS });
await print.writeTextMultiColumn(data1, { columnWidths: WIDTHS });
await print.writeTextMultiColumn(data2, { columnWidths: WIDTHS });
```

---

## 📚 Learn More

- **[Complete Guide](./MULTICOLUMN_GUIDE.md)** - Advanced usage and patterns
- **[Usage Guide](./USAGE_GUIDE.md)** - All PrintHub features
- **[README](./readme.md)** - Main documentation
- **[Test Page](./test-multicolumn.html)** - Interactive examples

---

## 🎉 You're Ready!

You now know how to use `writeTextMultiColumn()` to create beautiful, structured receipts and reports!

**Happy Printing!** 🖨️✨

---

**PrintHub v1.3.0** - Making Thermal Printing Easy
