# 📊 PrintHub Multi Column Guide

Complete guide for using the `writeTextMultiColumn()` method to print data in 3 or more columns.

---

## 🎯 Overview

The `writeTextMultiColumn()` method allows you to print data in a table-like format with 3 or more columns. This is perfect for:

- **Receipts** with item number, name, quantity, and price
- **Invoices** with detailed line items
- **Reports** with tabular data
- **Inventory lists** with multiple attributes

---

## 📖 Basic Syntax

```javascript
await print.writeTextMultiColumn(columns, options);
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `columns` | string[] | Yes | Array of text for each column |
| `options` | Object | No | Configuration options |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `columnWidths` | number[] | Auto | Width of each column in characters |
| `align` | string[] | ["left",...] | Alignment per column: "left", "center", "right" |
| `bold` | boolean | false | Print in bold |
| `underline` | boolean | false | Print with underline |
| `size` | string | "normal" | Text size: "normal" or "double" |

---

## 🚀 Quick Start

### Example 1: Basic 3-Column Layout

```javascript
await print.writeTextMultiColumn(
  ["Product", "Quantity", "Price"],
  { align: ["left", "center", "right"] }
);
```

**Output (58mm paper):**
```
Product          Quantity   Price
```

### Example 2: 4-Column Table with Custom Widths

```javascript
// Header
await print.writeTextMultiColumn(
  ["No", "Item", "Qty", "Price"],
  {
    columnWidths: [3, 15, 5, 9],
    align: ["left", "left", "center", "right"],
    bold: true
  }
);

// Data rows
await print.writeTextMultiColumn(
  ["1", "Nasi Goreng", "2x", "Rp 50.000"],
  {
    columnWidths: [3, 15, 5, 9],
    align: ["left", "left", "center", "right"]
  }
);
```

**Output (58mm paper):**
```
No Item            Qty   Price
1  Nasi Goreng     2x   Rp 50.000
```

---

## 💡 Column Width Calculation

### Paper Size Limits

| Paper Size | Total Characters | Recommended Max |
|------------|------------------|-----------------|
| 58mm | 32 characters | 32 |
| 80mm | 42 characters | 42 |

### Auto-Calculated Widths

If you don't specify `columnWidths`, they are automatically distributed equally:

```javascript
// 58mm paper with 4 columns = 8 chars per column
await print.writeTextMultiColumn(
  ["Col1", "Col2", "Col3", "Col4"]
);
```

### Custom Widths

Specify exact width for each column:

```javascript
await print.writeTextMultiColumn(
  ["No", "Item", "Qty", "Price"],
  {
    columnWidths: [3, 15, 5, 9] // Total = 32 (perfect for 58mm)
  }
);
```

⚠️ **Important:** Total of `columnWidths` must not exceed paper width (32 for 58mm, 42 for 80mm)

---

## 🎨 Alignment Options

Each column can have its own alignment:

```javascript
await print.writeTextMultiColumn(
  ["Left", "Center", "Right", "Mixed"],
  {
    align: ["left", "center", "right", "left"]
  }
);
```

### Best Practices

| Column Type | Recommended Alignment |
|-------------|----------------------|
| Item Number | left |
| Item Name | left |
| Quantity | center |
| Price/Amount | right |
| Status | center |

---

## 📋 Complete Examples

### Example 1: Simple Receipt Table

```javascript
const printer = new PrintHub({ paperSize: "58" });

printer.connectToPrint({
  onReady: async (print) => {
    // Header
    await print.writeText("INVOICE", { align: "center", bold: true });
    await print.writeDashLine();
    
    // Table Header
    await print.writeTextMultiColumn(
      ["No", "Item", "Qty", "Price"],
      {
        columnWidths: [3, 15, 5, 9],
        align: ["left", "left", "center", "right"],
        bold: true
      }
    );
    await print.writeDashLine();
    
    // Table Rows
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
    
    // Total (merged columns)
    await print.writeTextMultiColumn(
      ["", "", "TOTAL:", "100.000"],
      {
        columnWidths: [3, 15, 5, 9],
        align: ["left", "left", "right", "right"],
        bold: true
      }
    );
    
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => console.error(message)
});
```

### Example 2: Inventory List (5 Columns)

```javascript
// For 80mm paper (42 characters)
await print.writeTextMultiColumn(
  ["Code", "Product", "Stock", "Price", "Status"],
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
```

### Example 3: Sales Report with Subtotals

```javascript
printer.connectToPrint({
  onReady: async (print) => {
    await print.writeText("SALES REPORT", { 
      align: "center", 
      bold: true,
      size: "double"
    });
    await print.writeDashLine();
    
    // Header
    await print.writeTextMultiColumn(
      ["Date", "Items", "Total"],
      {
        columnWidths: [12, 10, 10],
        align: ["left", "center", "right"],
        bold: true,
        underline: true
      }
    );
    
    // Data
    await print.writeTextMultiColumn(
      ["2024-10-01", "45", "1.250.000"],
      { columnWidths: [12, 10, 10], align: ["left", "center", "right"] }
    );
    
    await print.writeTextMultiColumn(
      ["2024-10-02", "52", "1.450.000"],
      { columnWidths: [12, 10, 10], align: ["left", "center", "right"] }
    );
    
    await print.writeDashLine();
    
    // Grand Total
    await print.writeTextMultiColumn(
      ["TOTAL:", "97", "2.700.000"],
      {
        columnWidths: [12, 10, 10],
        align: ["left", "center", "right"],
        bold: true,
        size: "double"
      }
    );
    
    await print.writeLineBreak({ count: 3 });
  },
  onFailed: (message) => console.error(message)
});
```

---

## 🎯 Use Cases

### 1. Restaurant Order Receipt

```javascript
// No | Item | Qty | Price
await print.writeTextMultiColumn(
  ["1", "Burger Special", "2", "50.000"],
  {
    columnWidths: [3, 15, 4, 10],
    align: ["left", "left", "center", "right"]
  }
);
```

### 2. Product Catalog

```javascript
// Code | Name | Price | Stock
await print.writeTextMultiColumn(
  ["P123", "Product Name", "25.000", "100"],
  {
    columnWidths: [6, 16, 10, 10],
    align: ["left", "left", "right", "center"]
  }
);
```

### 3. Invoice with Tax

```javascript
// Description | Qty | Unit Price | Subtotal
await print.writeTextMultiColumn(
  ["Item A", "5", "10.000", "50.000"],
  {
    columnWidths: [15, 5, 10, 12],
    align: ["left", "center", "right", "right"]
  }
);
```

### 4. Attendance List

```javascript
// No | Name | Time In | Time Out
await print.writeTextMultiColumn(
  ["1", "John Doe", "08:00", "17:00"],
  {
    columnWidths: [3, 15, 7, 7],
    align: ["left", "left", "center", "center"]
  }
);
```

---

## ⚙️ Advanced Techniques

### 1. Merging Columns

Leave columns empty to create merged cells:

```javascript
// Merge first 3 columns for subtotal label
await print.writeTextMultiColumn(
  ["", "", "Subtotal:", "95.000"],
  {
    columnWidths: [3, 15, 5, 9],
    align: ["left", "left", "right", "right"]
  }
);
```

### 2. Dynamic Column Widths

Calculate widths based on content:

```javascript
function calculateColumnWidths(columns, totalWidth) {
  // Custom logic to distribute width based on content length
  const weights = columns.map(col => col.length);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  return weights.map(w => Math.floor((w / totalWeight) * totalWidth));
}

const widths = calculateColumnWidths(["No", "Product Name", "Qty", "Price"], 32);
```

### 3. Conditional Formatting

```javascript
const total = 100000;
await print.writeTextMultiColumn(
  ["", "", "TOTAL:", total.toString()],
  {
    columnWidths: [3, 15, 5, 9],
    align: ["left", "left", "right", "right"],
    bold: total > 50000, // Bold if total > 50k
    size: total > 100000 ? "double" : "normal" // Large if > 100k
  }
);
```

### 4. Alternating Row Styles

```javascript
const items = [/* ... */];

for (let i = 0; i < items.length; i++) {
  await print.writeTextMultiColumn(
    items[i],
    {
      columnWidths: [3, 15, 5, 9],
      align: ["left", "left", "center", "right"],
      bold: i % 2 === 0 // Bold every other row
    }
  );
}
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Text Overflow

**Problem:** Text is cut off with "~"

**Solution:** Increase column width or shorten text

```javascript
// ❌ Bad: Column too narrow
columnWidths: [3, 10, 5, 9] // Item name only 10 chars

// ✅ Good: Adequate width
columnWidths: [3, 15, 5, 9] // Item name has 15 chars
```

### Issue 2: Total Width Exceeds Paper

**Problem:** Error "Total column widths exceeds paper width"

**Solution:** Ensure total width ≤ paper limit

```javascript
// For 58mm (32 chars)
const widths = [3, 15, 5, 9]; // Total = 32 ✅
const badWidths = [5, 20, 10, 10]; // Total = 45 ❌
```

### Issue 3: Misaligned Columns

**Problem:** Columns don't line up between rows

**Solution:** Use same columnWidths for all rows

```javascript
const widths = [3, 15, 5, 9];

// Header
await print.writeTextMultiColumn(header, { columnWidths: widths });

// All data rows
for (const row of data) {
  await print.writeTextMultiColumn(row, { columnWidths: widths });
}
```

### Issue 4: Empty Column Display

**Problem:** Empty string shows as blank space

**Solution:** Use empty strings intentionally for spacing

```javascript
// This is correct - creates merged cell effect
await print.writeTextMultiColumn(
  ["", "", "Total:", "100.000"],
  { columnWidths: [3, 15, 5, 9] }
);
```

---

## 📊 Width Templates

### 58mm Paper (32 chars)

#### 3 Columns
```javascript
[10, 11, 11] // Equal
[8, 14, 10]  // Name-focused
[6, 16, 10]  // Wide center
```

#### 4 Columns
```javascript
[8, 8, 8, 8]   // Equal
[3, 15, 5, 9]  // Receipt format (No, Item, Qty, Price)
[4, 14, 6, 8]  // Balanced
```

#### 5 Columns
```javascript
[6, 6, 7, 7, 6]   // Equal
[3, 12, 5, 6, 6]  // Item list
```

### 80mm Paper (42 chars)

#### 3 Columns
```javascript
[14, 14, 14] // Equal
[12, 18, 12] // Name-focused
```

#### 4 Columns
```javascript
[10, 11, 10, 11] // Equal
[4, 20, 8, 10]   // Receipt format
```

#### 5 Columns
```javascript
[8, 8, 9, 8, 9]    // Equal
[6, 15, 7, 8, 6]   // Product catalog
```

---

## 🎓 Best Practices

### 1. Consistent Widths

Always use the same column widths for headers and data rows:

```javascript
const WIDTHS = [3, 15, 5, 9];

await print.writeTextMultiColumn(headers, { columnWidths: WIDTHS });
await print.writeTextMultiColumn(row1, { columnWidths: WIDTHS });
await print.writeTextMultiColumn(row2, { columnWidths: WIDTHS });
```

### 2. Proper Alignment

- Use **right** alignment for numbers and prices
- Use **center** for quantities and status
- Use **left** for text and names

### 3. Visual Hierarchy

```javascript
// Bold headers
await print.writeTextMultiColumn(headers, { bold: true });

// Normal data
await print.writeTextMultiColumn(data, {});

// Bold + Large for totals
await print.writeTextMultiColumn(total, { bold: true, size: "double" });
```

### 4. Spacing

Add visual separators between sections:

```javascript
await print.writeTextMultiColumn(headers, { bold: true });
await print.writeDashLine();
// ... data rows ...
await print.writeDashLine();
await print.writeTextMultiColumn(total, { bold: true });
```

---

## 🔗 Related Methods

- **`writeTextWith2Column()`** - For simple 2-column layouts
- **`writeDashLine()`** - Visual separator between table sections
- **`writeText()`** - For headers and single-line text
- **`writeLineBreak()`** - Add spacing

---

## 📝 Summary

The `writeTextMultiColumn()` method is a powerful tool for creating structured tabular data on thermal printers. Key points:

✅ **Flexible**: 3+ columns with custom or auto widths  
✅ **Precise**: Individual alignment per column  
✅ **Styled**: Bold, underline, and size options  
✅ **Compatible**: Works with 58mm and 80mm paper  
✅ **Reliable**: Automatic text truncation prevents overflow

Perfect for receipts, invoices, reports, and any data that needs a tabular format!

---

**Happy Printing! 🖨️**
