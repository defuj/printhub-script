import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

/**
 * PrintHub - Library untuk mencetak ke thermal printer via Bluetooth atau USB
 * 
 * @example
 * // Membuat instance PrintHub dengan Bluetooth printer 58mm
 * const printer = new PrintHub({ paperSize: "58", printerType: "bluetooth" });
 * 
 * @example
 * // Membuat instance PrintHub dengan USB printer 80mm
 * const printer = new PrintHub({ paperSize: "80", printerType: "usb" });
 */
class PrintHub {
  encoder: TextEncoder;
  center: Uint8Array;
  right: Uint8Array;
  left: Uint8Array;
  boldOn: Uint8Array;
  boldOff: Uint8Array;
  underlineOn: Uint8Array;
  underlineOff: Uint8Array;
  doubleSize: Uint8Array;
  normalSize: Uint8Array;
  printChar: BluetoothRemoteGATTCharacteristic | USBDevice | null;
  printerType: string;
  paperSize: string;

  /**
   * Constructor untuk membuat instance PrintHub
   * 
   * @param {Object} options - Opsi konfigurasi printer
   * @param {string} [options.paperSize="58"] - Ukuran kertas printer ("58" atau "80")
   * @param {string} [options.printerType="bluetooth"] - Tipe printer ("bluetooth" atau "usb")
   * 
   * @throws {Error} Jika paperSize bukan "58" atau "80"
   * @throws {Error} Jika printerType bukan "bluetooth" atau "usb"
   * 
   * @example
   * // Printer Bluetooth dengan kertas 58mm (default)
   * const printer = new PrintHub();
   * 
   * @example
   * // Printer USB dengan kertas 80mm
   * const printer = new PrintHub({ paperSize: "80", printerType: "usb" });
   */
  constructor({
    paperSize = "58",
    printerType = "bluetooth",
  }: { paperSize?: string; printerType?: string } = {}) {
    this.encoder = new TextEncoder();
    this.center = new Uint8Array([27, 97, 1]);
    this.right = new Uint8Array([27, 97, 2]);
    this.left = new Uint8Array([27, 97, 0]);
    this.boldOn = new Uint8Array([27, 69, 1]);
    this.boldOff = new Uint8Array([27, 69, 0]);
    this.underlineOn = new Uint8Array([27, 45, 1]);
    this.underlineOff = new Uint8Array([27, 45, 0]);
    this.doubleSize = new Uint8Array([29, 33, 17]);
    this.normalSize = new Uint8Array([29, 33, 0]);
    this.printChar = null;
    this.printerType = printerType;

    if (printerType !== "bluetooth" && printerType !== "usb") {
      throw new Error(
        'Invalid printer type. Only "bluetooth" and "usb" are supported.'
      );
    }

    if (paperSize !== "58" && paperSize !== "80") {
      throw new Error('Invalid paper size. Only "58" and "80" are supported.');
    }

    this.paperSize = paperSize;
  }

  /**
   * Mengubah ukuran kertas printer
   * 
   * @param {string} paperSize - Ukuran kertas baru ("58" atau "80")
   * 
   * @example
   * printer.setPaperSize("80");
   */
  setPaperSize(paperSize: string) {
    this.paperSize = paperSize;
  }

  /**
   * Mengecek apakah Bluetooth tersedia di perangkat
   * 
   * @returns {Promise<boolean>} True jika Bluetooth tersedia, false jika tidak
   * 
   * @example
   * const isAvailable = await printer.checkBluetooth();
   * if (isAvailable) {
   *   console.log("Bluetooth tersedia");
   * }
   */
  async checkBluetooth(): Promise<boolean> {
    return navigator.bluetooth.getAvailability();
  }

  /**
   * Mengatur format teks ke default (kiri, ukuran normal, tanpa bold/underline)
   * Method internal untuk reset format setelah mencetak
   * 
   * @private
   * @param {BluetoothRemoteGATTCharacteristic} charp - Characteristic Bluetooth
   */
  async setDefault(charp: BluetoothRemoteGATTCharacteristic) {
    if (charp) {
      await charp.writeValue(this.left.buffer as ArrayBuffer);
      await charp.writeValue(this.normalSize.buffer as ArrayBuffer);
      await charp.writeValue(this.boldOff.buffer as ArrayBuffer);
      await charp.writeValue(this.underlineOff.buffer as ArrayBuffer);
    }
  }

  /**
   * Mencetak line break (baris kosong/enter)
   * 
   * @param {Object} [options] - Opsi line break
   * @param {number} [options.count=1] - Jumlah baris kosong yang ingin dicetak
   * 
   * @example
   * // Mencetak 1 baris kosong
   * await print.writeLineBreak();
   * 
   * @example
   * // Mencetak 3 baris kosong
   * await print.writeLineBreak({ count: 3 });
   */
  async writeLineBreak({ count = 1 }: { count?: number } = {}) {
    if (!this.printChar) return;
    if (this.printerType === "usb") {
      await this.writeUsbLineBreak(count);
    } else {
      await this.writeBluetoothLineBreak(count);
    }
  }

  /**
   * Method internal untuk mencetak line break via USB
   * 
   * @private
   * @param {number} count - Jumlah line break
   */
  private async writeUsbLineBreak(count: number) {
    const textData = [0x0a];
    const device = this.printChar as USBDevice;
    for (let i = 0; i < count; i++) {
      try {
        const usbConfig = device.configuration;
        if (!usbConfig) {
          throw new Error("No suitable configuration found for USB printing.");
        }
        const usbEndPoints = usbConfig.interfaces[0].alternate.endpoints.find(
          (endpoint) => endpoint.direction === "out"
        );
        if (!usbEndPoints) {
          throw new Error("No suitable endpoint found for USB printing.");
        }
        await device.transferOut(
          usbEndPoints.endpointNumber,
          new Uint8Array(textData)
        );
      } catch {
        throw new Error("Failed to print via USB");
      }
    }
  }

  /**
   * Method internal untuk mencetak line break via Bluetooth
   * 
   * @private
   * @param {number} count - Jumlah line break
   */
  private async writeBluetoothLineBreak(count: number) {
    const device = this.printChar as BluetoothRemoteGATTCharacteristic;
    for (let i = 0; i < count; i++) {
      await device.writeValue(new Uint8Array([10]).buffer);
    }
  }

  /**
   * Mencetak garis putus-putus (dash line) sebagai pemisah
   * Panjang garis disesuaikan dengan ukuran kertas (32 karakter untuk 58mm, 42 untuk 80mm)
   * 
   * @example
   * await print.writeDashLine();
   * // Output: -------------------------------- (untuk 58mm)
   * // Output: ------------------------------------------ (untuk 80mm)
   */
  async writeDashLine() {
    if (!this.printChar) return;
    const dashLine = "-".repeat(this.paperSize === "58" ? 32 : 42);
    if (this.printerType === "usb") {
      await this.printUsbText(dashLine);
    } else {
      await (this.printChar as BluetoothRemoteGATTCharacteristic).writeValue(
        this.encoder.encode(dashLine)
      );
    }
    await this.writeLineBreak();
  }

  /**
   * Method internal untuk mencetak teks via USB (tanpa format)
   * 
   * @private
   * @param {string} text - Teks yang akan dicetak
   */
  private async printUsbText(text: string) {
    const textData = [...this.encoder.encode(text)];
    try {
      const usbConfig = (this.printChar as USBDevice).configuration;
      if (!usbConfig) {
        throw new Error("No suitable configuration found for USB printing.");
      }
      const usbEndPoints = usbConfig.interfaces[0].alternate.endpoints.find(
        (endpoint) => endpoint.direction === "out"
      );
      if (!usbEndPoints) {
        throw new Error("No suitable endpoint found for USB printing.");
      }
      await (this.printChar as USBDevice).transferOut(
        usbEndPoints.endpointNumber,
        new Uint8Array(textData)
      );
    } catch {
      throw new Error("Failed to print via USB");
    }
  }

  /**
   * Mencetak teks dalam 2 kolom (kiri dan kanan)
   * Berguna untuk mencetak data seperti: "Nama Barang         Rp 50.000"
   * Spasi otomatis ditambahkan di tengah agar text2 rata kanan
   * 
   * @param {string} text1 - Teks kolom kiri
   * @param {string} text2 - Teks kolom kanan
   * @param {Object} [options] - Opsi format teks
   * @param {boolean} [options.bold=false] - Cetak dengan huruf tebal
   * @param {boolean} [options.underline=false] - Cetak dengan garis bawah
   * @param {string} [options.align="left"] - Alignment: "left", "center", atau "right"
   * @param {string} [options.size="normal"] - Ukuran teks: "normal" atau "double"
   * 
   * @example
   * // Mencetak item dengan harga
   * await print.writeTextWith2Column("Nasi Goreng", "Rp 25.000");
   * // Output: "Nasi Goreng              Rp 25.000"
   * 
   * @example
   * // Dengan format bold
   * await print.writeTextWith2Column("Total", "Rp 100.000", { bold: true });
   */
  async writeTextWith2Column(
    text1: string,
    text2: string,
    options: {
      bold?: boolean;
      underline?: boolean;
      align?: string;
      size?: string;
    } = {}
  ) {
    const device = this.printChar;
    if (!device) return;

    const {
      bold = false,
      underline = false,
      align = "left",
      size = "normal",
    } = options;
    const formattedText = this.createItemData(text1, text2);

    if (this.printerType === "usb") {
      await this.writeUsbTextWith2Column(formattedText, {
        bold,
        underline,
        align,
        size,
      });
    } else {
      await this.writeBluetoothTextWith2Column(
        formattedText,
        { bold, underline, align, size },
        device as BluetoothRemoteGATTCharacteristic
      );
    }
  }

  /**
   * Method internal untuk mencetak teks 2 kolom via USB
   * 
   * @private
   */
  private async writeUsbTextWith2Column(
    text: string,
    {
      bold = false,
      underline = false,
      align = "left",
      size = "normal",
    }: {
      bold?: boolean;
      underline?: boolean;
      align?: string;
      size?: string;
    }
  ) {
    const device = this.printChar as USBDevice;
    const alignValue = align === "center" ? 0x1 : align === "right" ? 0x2 : 0x0;
    const textData = [
      0x1b,
      0x21,
      bold ? 0x8 : 0x0,
      0x1b,
      0x2d,
      underline ? 0x1 : 0x0,
      0x1b,
      0x61,
      alignValue,
      0x1d,
      0x21,
      size === "double" ? 0x11 : 0x0,
      ...this.encoder.encode(text),
      0x0a,
    ];

    try {
      const usbConfig = device.configuration;
      if (!usbConfig)
        throw new Error("No suitable configuration found for USB printing.");
      const usbEndPoints = usbConfig.interfaces[0].alternate.endpoints.find(
        (endpoint) => endpoint.direction === "out"
      );
      if (!usbEndPoints)
        throw new Error("No suitable endpoint found for USB printing.");
      await device.transferOut(
        usbEndPoints.endpointNumber,
        new Uint8Array(textData)
      );
    } catch {
      throw new Error("Failed to print via USB");
    }
  }

  /**
   * Method internal untuk mencetak teks 2 kolom via Bluetooth
   * 
   * @private
   */
  private async writeBluetoothTextWith2Column(
    text: string,
    {
      bold = false,
      underline = false,
      align = "left",
      size = "normal",
    }: {
      bold?: boolean;
      underline?: boolean;
      align?: string;
      size?: string;
    },
    device: BluetoothRemoteGATTCharacteristic
  ) {
    if (bold) await device.writeValue(this.boldOn.buffer as ArrayBuffer);
    if (underline) await device.writeValue(this.underlineOn.buffer as ArrayBuffer);

    if (align === "center") {
      await device.writeValue(this.center.buffer as ArrayBuffer);
    } else if (align === "right") {
      await device.writeValue(this.right.buffer as ArrayBuffer);
    }

    if (size === "double") await device.writeValue(this.doubleSize.buffer as ArrayBuffer);

    await device.writeValue(this.encoder.encode(text).buffer as ArrayBuffer);
    await this.setDefault(device);
    await this.writeLineBreak();
  }

  /**
   * Mencetak teks dalam multiple kolom (3 atau lebih kolom)
   * Berguna untuk mencetak data tabel seperti: "No | Item | Qty | Price"
   * 
   * @param {string[]} columns - Array berisi teks untuk setiap kolom
   * @param {Object} [options] - Opsi format dan layout
   * @param {number[]} [options.columnWidths] - Lebar setiap kolom dalam karakter. Jika tidak diset, akan dibagi rata.
   * @param {string[]} [options.align] - Alignment untuk setiap kolom: "left", "center", "right". Default semua "left".
   * @param {boolean} [options.bold=false] - Cetak dengan huruf tebal
   * @param {boolean} [options.underline=false] - Cetak dengan garis bawah
   * @param {string} [options.size="normal"] - Ukuran teks: "normal" atau "double"
   * 
   * @example
   * // Mencetak tabel sederhana dengan 4 kolom
   * await print.writeTextMultiColumn(
   *   ["1", "Nasi Goreng", "2x", "Rp 50.000"],
   *   {
   *     columnWidths: [3, 15, 5, 9], // Total: 32 char (58mm)
   *     align: ["left", "left", "center", "right"]
   *   }
   * );
   * // Output: "1  Nasi Goreng       2x   Rp 50.000"
   * 
   * @example
   * // Dengan auto width (dibagi rata)
   * await print.writeTextMultiColumn(
   *   ["No", "Item", "Price"],
   *   { align: ["left", "left", "right"] }
   * );
   * 
   * @example
   * // Header tabel dengan bold
   * await print.writeTextMultiColumn(
   *   ["No", "Item", "Qty", "Price"],
   *   { 
   *     columnWidths: [3, 15, 5, 9],
   *     align: ["left", "left", "center", "right"],
   *     bold: true 
   *   }
   * );
   */
  async writeTextMultiColumn(
    columns: string[],
    options: {
      columnWidths?: number[];
      align?: string[];
      bold?: boolean;
      underline?: boolean;
      size?: string;
    } = {}
  ) {
    const device = this.printChar;
    if (!device) return;

    // Validate input
    if (!columns || columns.length === 0) {
      throw new Error("Columns array cannot be empty");
    }

    const {
      bold = false,
      underline = false,
      size = "normal",
    } = options;

    // Format the text with multiple columns
    const formattedText = this.createMultiColumnData(columns, options);

    // Print using appropriate method
    if (this.printerType === "usb") {
      await this.writeUsbTextMultiColumn(formattedText, {
        bold,
        underline,
        size,
      });
    } else {
      await this.writeBluetoothTextMultiColumn(
        formattedText,
        { bold, underline, size },
        device as BluetoothRemoteGATTCharacteristic
      );
    }
  }

  /**
   * Method internal untuk memformat teks multiple kolom
   * Menambahkan spasi dan alignment sesuai konfigurasi
   * 
   * @private
   * @param {string[]} columns - Array berisi teks untuk setiap kolom
   * @param {Object} options - Opsi layout kolom
   * @returns {string} Teks yang sudah diformat dengan spasi
   */
  private createMultiColumnData(
    columns: string[],
    options: {
      columnWidths?: number[];
      align?: string[];
    }
  ): string {
    const totalChar = this.paperSize === "58" ? 32 : 42;
    const numColumns = columns.length;
    
    // Calculate column widths
    let columnWidths: number[];
    if (options.columnWidths && options.columnWidths.length === numColumns) {
      columnWidths = options.columnWidths;
      
      // Validate total width
      const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
      if (totalWidth > totalChar) {
        throw new Error(
          `Total column widths (${totalWidth}) exceeds paper width (${totalChar})`
        );
      }
    } else {
      // Auto-calculate equal widths
      const widthPerColumn = Math.floor(totalChar / numColumns);
      columnWidths = new Array(numColumns).fill(widthPerColumn);
      
      // Distribute remaining space
      const remainder = totalChar - (widthPerColumn * numColumns);
      for (let i = 0; i < remainder; i++) {
        columnWidths[i]++;
      }
    }

    // Set alignment for each column (default: left)
    const alignments = options.align || new Array(numColumns).fill("left");

    // Format each column
    let result = "";
    for (let i = 0; i < numColumns; i++) {
      let text = columns[i] || "";
      const width = columnWidths[i];
      const alignment = alignments[i] || "left";

      // Truncate if text is too long
      if (text.length > width) {
        text = text.substring(0, width - 1) + "~";
      }

      // Apply alignment
      if (alignment === "right") {
        result += text.padStart(width, " ");
      } else if (alignment === "center") {
        const totalPadding = width - text.length;
        const leftPadding = Math.floor(totalPadding / 2);
        const rightPadding = totalPadding - leftPadding;
        result += " ".repeat(leftPadding) + text + " ".repeat(rightPadding);
      } else {
        // left alignment
        result += text.padEnd(width, " ");
      }
    }

    return result.trim();
  }

  /**
   * Method internal untuk mencetak teks multiple kolom via USB
   * 
   * @private
   */
  private async writeUsbTextMultiColumn(
    text: string,
    {
      bold = false,
      underline = false,
      size = "normal",
    }: {
      bold?: boolean;
      underline?: boolean;
      size?: string;
    }
  ) {
    const device = this.printChar as USBDevice;
    const textData = [
      0x1b,
      0x21,
      bold ? 0x8 : 0x0,
      0x1b,
      0x2d,
      underline ? 0x1 : 0x0,
      0x1b,
      0x61,
      0x0, // Always left align for multi-column (alignment is in the text itself)
      0x1d,
      0x21,
      size === "double" ? 0x11 : 0x0,
      ...this.encoder.encode(text),
      0x0a,
    ];

    try {
      const usbConfig = device.configuration;
      if (!usbConfig)
        throw new Error("No suitable configuration found for USB printing.");
      const usbEndPoints = usbConfig.interfaces[0].alternate.endpoints.find(
        (endpoint) => endpoint.direction === "out"
      );
      if (!usbEndPoints)
        throw new Error("No suitable endpoint found for USB printing.");
      await device.transferOut(
        usbEndPoints.endpointNumber,
        new Uint8Array(textData)
      );
    } catch {
      throw new Error("Failed to print via USB");
    }
  }

  /**
   * Method internal untuk mencetak teks multiple kolom via Bluetooth
   * 
   * @private
   */
  private async writeBluetoothTextMultiColumn(
    text: string,
    {
      bold = false,
      underline = false,
      size = "normal",
    }: {
      bold?: boolean;
      underline?: boolean;
      size?: string;
    },
    device: BluetoothRemoteGATTCharacteristic
  ) {
    if (bold) await device.writeValue(this.boldOn.buffer as ArrayBuffer);
    if (underline) await device.writeValue(this.underlineOn.buffer as ArrayBuffer);
    
    // Always left align for multi-column (alignment is in the text itself)
    await device.writeValue(this.left.buffer as ArrayBuffer);

    if (size === "double") await device.writeValue(this.doubleSize.buffer as ArrayBuffer);

    await device.writeValue(this.encoder.encode(text).buffer as ArrayBuffer);
    await this.setDefault(device);
    await this.writeLineBreak();
  }

  /**
   * Mencetak teks dengan berbagai opsi format
   * Method utama untuk mencetak teks dengan atau tanpa format
   * 
   * @param {string} text - Teks yang akan dicetak
   * @param {Object} [options] - Opsi format teks
   * @param {boolean} [options.bold=false] - Cetak dengan huruf tebal
   * @param {boolean} [options.underline=false] - Cetak dengan garis bawah
   * @param {string} [options.align="left"] - Alignment: "left", "center", atau "right"
   * @param {string} [options.size="normal"] - Ukuran teks: "normal" atau "double"
   * 
   * @example
   * // Mencetak teks biasa
   * await print.writeText("Hello World");
   * 
   * @example
   * // Mencetak teks bold dan center
   * await print.writeText("STRUK PEMBAYARAN", { bold: true, align: "center" });
   * 
   * @example
   * // Mencetak teks dengan ukuran double
   * await print.writeText("TOTAL", { size: "double", bold: true });
   * 
   * @example
   * // Kombinasi semua opsi
   * await print.writeText("PENTING!", { 
   *   bold: true, 
   *   underline: true, 
   *   align: "center", 
   *   size: "double" 
   * });
   */
  async writeText(
    text: string,
    {
      bold = false,
      underline = false,
      align = "left",
      size = "normal",
    }: {
      bold?: boolean;
      underline?: boolean;
      align?: string;
      size?: string;
    } = {}
  ) {
    const device = this.printChar;
    if (device) {
      if (this.printerType === "usb") {
        const textData = [
          0x1b,
          0x21,
          bold ? 0x8 : 0x0, // Set bold
          0x1b,
          0x2d,
          underline ? 0x1 : 0x0, // Set underline
          0x1b,
          0x61, // Alignment
          align === "center" ? 0x1 : align === "right" ? 0x2 : 0x0,
          0x1d,
          0x21,
          size === "double" ? 0x11 : 0x0, // Set size
          ...this.encoder.encode(text), // Add text data
          0x0a, // Line feed
        ];

        try {
          const usbConfig = (device as USBDevice).configuration;
          if (usbConfig) {
            const usbEndPoints =
              usbConfig.interfaces[0].alternate.endpoints.find(
                (endpoint) => endpoint.direction === "out"
              );
            if (usbEndPoints) {
              await (device as USBDevice).transferOut(
                usbEndPoints.endpointNumber,
                new Uint8Array(textData)
              );
            } else {
              throw new Error("No suitable endpoint found for USB printing.");
            }
          } else {
            throw new Error(
              "No suitable configuration found for USB printing."
            );
          }
        } catch (error) {
          throw new Error("Failed to print via USB");
        }
      } else {
        if (bold) {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.boldOn.buffer as ArrayBuffer
          );
        }

        if (underline) {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.underlineOn.buffer as ArrayBuffer
          );
        }

        if (align === "center") {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.center.buffer as ArrayBuffer
          );
        } else if (align === "right") {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.right.buffer as ArrayBuffer
          );
        } else {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.left.buffer as ArrayBuffer
          );
        }

        if (size === "double") {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.doubleSize.buffer as ArrayBuffer
          );
        }

        await (device as BluetoothRemoteGATTCharacteristic).writeValue(
          this.encoder.encode(text).buffer as ArrayBuffer
        );
        await this.setDefault(device as BluetoothRemoteGATTCharacteristic);
        await this.writeLineBreak();
      }
    }
  }

  /**
   * Mencetak teks panjang dengan auto-wrapping
   * Teks akan otomatis dipecah ke beberapa baris sesuai lebar kertas
   * Berguna untuk mencetak alamat, deskripsi produk, notes, atau terms & conditions
   * 
   * @param {string} text - Teks yang akan dicetak (bisa sangat panjang)
   * @param {Object} [options] - Opsi format teks
   * @param {boolean} [options.bold=false] - Cetak dengan huruf tebal
   * @param {boolean} [options.underline=false] - Cetak dengan garis bawah
   * @param {string} [options.align="left"] - Alignment: "left", "center", "right", "justify"
   * @param {string} [options.size="normal"] - Ukuran teks: "normal" atau "double"
   * @param {number} [options.maxWidth] - Lebar maksimal per baris (default: sesuai paper size)
   * 
   * @example
   * // Mencetak alamat panjang
   * await print.writeWrappedText(
   *   "Jl. Sudirman No. 123, Blok A, RT 01/RW 02, Kelurahan Menteng, Kecamatan Menteng, Jakarta Pusat 10310"
   * );
   * 
   * @example
   * // Deskripsi produk dengan alignment
   * await print.writeWrappedText(
   *   "Produk ini adalah hasil dari penelitian panjang yang menghasilkan kualitas terbaik dengan harga yang terjangkau untuk semua kalangan",
   *   { align: "justify" }
   * );
   * 
   * @example
   * // Terms & conditions dengan bold
   * await print.writeWrappedText(
   *   "SYARAT DAN KETENTUAN: Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan kecuali ada cacat produksi. Garansi berlaku 30 hari sejak tanggal pembelian.",
   *   { bold: true, align: "left" }
   * );
   * 
   * @example
   * // Custom max width
   * await print.writeWrappedText(
   *   "Teks ini akan di-wrap dengan lebar maksimal 20 karakter per baris",
   *   { maxWidth: 20, align: "center" }
   * );
   */
  async writeWrappedText(
    text: string,
    {
      bold = false,
      underline = false,
      align = "left",
      size = "normal",
      maxWidth,
    }: {
      bold?: boolean;
      underline?: boolean;
      align?: string;
      size?: string;
      maxWidth?: number;
    } = {}
  ) {
    if (!text || text.trim().length === 0) {
      return;
    }

    // Determine max width based on paper size and text size
    const baseWidth = this.paperSize === "58" ? 32 : 42;
    const effectiveWidth = maxWidth || (size === "double" ? Math.floor(baseWidth / 2) : baseWidth);

    // Wrap the text into multiple lines
    const wrappedLines = this.wrapText(text, effectiveWidth, align === "justify");

    // Print each line
    for (let i = 0; i < wrappedLines.length; i++) {
      const line = wrappedLines[i];
      const isLastLine = i === wrappedLines.length - 1;
      
      // Don't justify the last line
      const lineAlign = (align === "justify" && !isLastLine) ? "left" : align;
      
      await this.writeText(line, {
        bold,
        underline,
        align: lineAlign === "justify" ? "left" : lineAlign,
        size
      });
    }
  }

  /**
   * Method internal untuk membungkus teks panjang menjadi beberapa baris
   * Mempertahankan kata-kata utuh dan tidak memotong di tengah kata
   * 
   * @private
   * @param {string} text - Teks yang akan dibungkus
   * @param {number} maxWidth - Lebar maksimal per baris
   * @param {boolean} justify - Apakah text harus di-justify (spasi merata)
   * @returns {string[]} Array berisi baris-baris text yang sudah dibungkus
   */
  private wrapText(text: string, maxWidth: number, justify: boolean = false): string[] {
    // Clean up the text (remove extra spaces, normalize whitespace)
    const cleanText = text.trim().replace(/\s+/g, ' ');
    
    if (cleanText.length <= maxWidth) {
      return [cleanText];
    }

    const lines: string[] = [];
    const words = cleanText.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;

      if (testLine.length <= maxWidth) {
        currentLine = testLine;
      } else {
        // If current line is not empty, save it
        if (currentLine) {
          // Apply justification if needed (except for last line)
          if (justify && i < words.length - 1) {
            lines.push(this.justifyLine(currentLine, maxWidth));
          } else {
            lines.push(currentLine);
          }
          currentLine = word;
        } else {
          // Word is too long, need to break it
          if (word.length > maxWidth) {
            // Break long word
            let remainingWord = word;
            while (remainingWord.length > maxWidth) {
              lines.push(remainingWord.substring(0, maxWidth));
              remainingWord = remainingWord.substring(maxWidth);
            }
            currentLine = remainingWord;
          } else {
            currentLine = word;
          }
        }
      }
    }

    // Add the last line
    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Method internal untuk justify text (menambahkan spasi merata)
   * 
   * @private
   * @param {string} line - Baris text yang akan di-justify
   * @param {number} targetWidth - Lebar target yang diinginkan
   * @returns {string} Baris text yang sudah di-justify
   */
  private justifyLine(line: string, targetWidth: number): string {
    const words = line.trim().split(' ');
    
    // Single word, no justification needed
    if (words.length === 1) {
      return line;
    }

    // Calculate total characters in words
    const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
    const totalSpacesNeeded = targetWidth - totalWordLength;
    const gapCount = words.length - 1;

    // If can't justify properly, return as is
    if (totalSpacesNeeded <= 0 || gapCount <= 0) {
      return line;
    }

    // Calculate spaces per gap
    const baseSpaces = Math.floor(totalSpacesNeeded / gapCount);
    const extraSpaces = totalSpacesNeeded % gapCount;

    // Build justified line
    let justifiedLine = '';
    for (let i = 0; i < words.length; i++) {
      justifiedLine += words[i];
      
      if (i < words.length - 1) {
        // Add base spaces
        justifiedLine += ' '.repeat(baseSpaces);
        
        // Add extra space to first N gaps
        if (i < extraSpaces) {
          justifiedLine += ' ';
        }
      }
    }

    return justifiedLine;
  }

  /**
   * Menghubungkan ke printer dan siap untuk mencetak
   * Method utama yang harus dipanggil pertama kali sebelum mencetak
   * Akan menampilkan dialog pemilihan printer (Bluetooth/USB) di browser
   * 
   * @param {Object} callbacks - Callback functions
   * @param {Function} callbacks.onReady - Dipanggil saat koneksi berhasil, menerima instance printer
   * @param {Function} callbacks.onFailed - Dipanggil saat koneksi gagal, menerima pesan error
   * 
   * @example
   * // Koneksi dan langsung mencetak
   * printer.connectToPrint({
   *   onReady: async (print) => {
   *     await print.writeText("Hello World");
   *     await print.writeDashLine();
   *     await print.writeTextWith2Column("Total", "Rp 50.000", { bold: true });
   *     await print.writeLineBreak(3);
   *   },
   *   onFailed: (message) => {
   *     console.error("Koneksi gagal:", message);
   *     alert(message);
   *   }
   * });
   * 
   * @example
   * // Dengan error handling yang lebih baik
   * printer.connectToPrint({
   *   onReady: async (print) => {
   *     try {
   *       await print.writeText("TOKO SAYA", { align: "center", bold: true });
   *       await print.writeDashLine();
   *       // ... cetak struk
   *     } catch (error) {
   *       console.error("Error saat mencetak:", error);
   *     }
   *   },
   *   onFailed: (message) => {
   *     if (message.includes("Bluetooth")) {
   *       alert("Browser Anda tidak mendukung Bluetooth");
   *     } else {
   *       alert("Gagal terhubung: " + message);
   *     }
   *   }
   * });
   */
  async connectToPrint({
    onReady,
    onFailed,
  }: {
    onReady: (printer: PrintHub) => void;
    onFailed: (message: string) => void;
  }) {
    try {
      if (this.printerType === "usb") {
        await this.connectUsbPrinter(onReady, onFailed);
      } else if (this.printerType === "bluetooth") {
        await this.connectBluetoothPrinter(onReady, onFailed);
      } else {
        onFailed("Printer type not supported.");
      }
    } catch (error) {
      onFailed("Failed to connect to printer");
    }
  }

  /**
   * Method internal untuk koneksi ke USB printer
   * 
   * @private
   */
  private async connectUsbPrinter(
    onReady: (printer: PrintHub) => void,
    onFailed: (message: string) => void
  ) {
    try {
      const device = await navigator.usb.requestDevice({ filters: [] });
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);
      this.printChar = device;
      onReady(this);
    } catch (error: any) {
      onFailed(error.message || "Failed to connect to USB printer.");
    }
  }

  /**
   * Method internal untuk koneksi ke Bluetooth printer
   * 
   * @private
   */
  private async connectBluetoothPrinter(
    onReady: (printer: PrintHub) => void,
    onFailed: (message: string) => void
  ) {
    try {
      if (!(await this.checkBluetooth())) {
        onFailed(
          "Perangkat Anda tidak mendukung untuk melakukan print dengan Bluetooth"
        );
        return;
      }
      if (this.printChar != null) {
        onReady(this);
        return;
      }
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          {
            services: ["000018f0-0000-1000-8000-00805f9b34fb"],
          },
        ],
      });
      if (!device.gatt) {
        onFailed("Device not found");
        return;
      }
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(
        "000018f0-0000-1000-8000-00805f9b34fb"
      );
      const characteristics = await service.getCharacteristics();
      const writableCharacteristic = characteristics.find(
        (characteristic) => characteristic.properties.write
      );
      if (writableCharacteristic) {
        this.printChar = writableCharacteristic;
        onReady(this);
      } else {
        onFailed("No writable characteristic found.");
      }
    } catch (error: any) {
      onFailed(error.message || "Failed to connect to Bluetooth printer.");
    }
  }

  /**
   * Method internal untuk memformat teks 2 kolom
   * Menambahkan spasi di tengah agar kolom kanan rata kanan
   * Menangani text yang terlalu panjang dengan truncation
   * 
   * @private
   * @param {string} start - Teks kolom kiri
   * @param {string} end - Teks kolom kanan
   * @returns {string} Teks yang sudah diformat dengan spasi
   */
  createItemData(start: string, end: string): string {
    const totalChar = this.paperSize == "58" ? 32 : 42;
    const minSpace = 3;

    if (start.length + end.length > totalChar) {
      const availableLength = totalChar - end.length - minSpace;
      if (availableLength > 0) {
        start = start.substring(0, availableLength) + "   ";
      } else {
        start = "   ";
      }
    }

    return start + " ".repeat(totalChar - start.length - end.length) + end;
  }

  /**
   * Method internal untuk memproses dan mencetak image data
   * Mengkonversi gambar ke format thermal printer (bitmap monochrome)
   * 
   * @private
   * @param {CanvasImageSource} image - Image yang akan dicetak (dari Image, Canvas, dll)
   * @param {string} align - Alignment gambar: "left", "center", atau "right"
   */
  private async printImageData(
    image: CanvasImageSource,
    align: string = "left"
  ): Promise<void> {
    const device = this.printChar;
    if (!device) {
      throw new Error("Printer not connected");
    }

    if (align === "center") {
      await (device as BluetoothRemoteGATTCharacteristic).writeValue(
        this.center.buffer as ArrayBuffer
      );
    } else if (align === "right") {
      await (device as BluetoothRemoteGATTCharacteristic).writeValue(
        this.right.buffer as ArrayBuffer
      );
    } else {
      await (device as BluetoothRemoteGATTCharacteristic).writeValue(this.left.buffer as ArrayBuffer);
    }

    let imageData: Uint8ClampedArray;
    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 120;
    const context = canvas.getContext("2d");

    if (context && image) {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    } else {
      throw new Error("Failed to process image");
    }

    const getDarkPixel = (x: number, y: number): number => {
      const red = imageData[(canvas.width * y + x) * 4];
      const green = imageData[(canvas.width * y + x) * 4 + 1];
      const blue = imageData[(canvas.width * y + x) * 4 + 2];
      return red + green + blue > 0 ? 1 : 0;
    };

    const getImagePrintData = (): Uint8Array => {
      if (!imageData) {
        console.log("No image to print!");
        return new Uint8Array([]);
      }
      const printData = new Uint8Array((canvas.width / 8) * canvas.height + 8);
      let offset = 0;
      printData[0] = 29;
      printData[1] = 118;
      printData[2] = 48;
      printData[3] = 0;
      printData[4] = canvas.width / 8;
      printData[5] = 0;
      printData[6] = canvas.height % 256;
      printData[7] = canvas.height / 256;
      offset = 7;
      for (let i = 0; i < canvas.height; ++i) {
        for (let k = 0; k < canvas.width / 8; ++k) {
          const k8 = k * 8;
          printData[++offset] =
            getDarkPixel(k8 + 0, i) * 128 +
            getDarkPixel(k8 + 1, i) * 64 +
            getDarkPixel(k8 + 2, i) * 32 +
            getDarkPixel(k8 + 3, i) * 16 +
            getDarkPixel(k8 + 4, i) * 8 +
            getDarkPixel(k8 + 5, i) * 4 +
            getDarkPixel(k8 + 6, i) * 2 +
            getDarkPixel(k8 + 7, i);
        }
      }
      return printData;
    };

    const printData = getImagePrintData();

    if (this.printerType === "bluetooth") {
      await this.sendImageDataBluetooth(printData);
    } else {
      await this.sendImageDataUsb(printData);
    }
  }

  /**
   * Method internal untuk mengirim image data via Bluetooth
   * Data dikirim dalam chunks 512 bytes untuk kompatibilitas
   * 
   * @private
   * @param {Uint8Array} data - Image data yang sudah diformat
   */
  private async sendImageDataBluetooth(data: Uint8Array): Promise<void> {
    const device = this.printChar as BluetoothRemoteGATTCharacteristic;
    let index = 0;

    while (index < data.length) {
      const chunkSize = Math.min(512, data.length - index);
      const chunk = data.slice(index, index + chunkSize);
      await device.writeValue(chunk.buffer as ArrayBuffer);
      index += chunkSize;
    }
  }

  /**
   * Method internal untuk mengirim image data via USB
   * 
   * @private
   * @param {Uint8Array} data - Image data yang sudah diformat
   */
  private async sendImageDataUsb(data: Uint8Array): Promise<void> {
    const device = this.printChar as USBDevice;
    const usbConfig = device.configuration;
    if (!usbConfig) {
      throw new Error("No suitable configuration found for USB printing.");
    }
    const usbEndPoint = usbConfig.interfaces[0].alternate.endpoints.find(
      (endpoint) => endpoint.direction === "out"
    );
    if (!usbEndPoint) {
      throw new Error("No suitable endpoint found for USB printing.");
    }
    await device.transferOut(usbEndPoint.endpointNumber, data.buffer as ArrayBuffer);
  }

  /**
   * Mencetak gambar dari URL
   * Gambar akan di-download, di-resize ke 120x120px, dan dikonversi ke monochrome
   * Kemudian dicetak ke thermal printer
   * 
   * @param {string} url - URL gambar yang akan dicetak (PNG, JPG, dll)
   * @param {Object} [options] - Opsi untuk mencetak gambar
   * @param {string} [options.align="left"] - Alignment gambar: "left", "center", atau "right"
   * @param {Function} [options.onFailed] - Callback jika gagal, menerima pesan error
   * 
   * @example
   * // Mencetak logo toko dari URL
   * await print.putImageWithUrl("https://example.com/logo.png");
   * 
   * @example
   * // Mencetak gambar dengan alignment center
   * await print.putImageWithUrl("https://example.com/logo.png", { 
   *   align: "center" 
   * });
   * 
   * @example
   * // Dengan error handling
   * await print.putImageWithUrl(
   *   "https://example.com/logo.png",
   *   {
   *     align: "center",
   *     onFailed: (message) => {
   *       console.error("Gagal mencetak gambar:", message);
   *       alert("Tidak bisa mencetak gambar: " + message);
   *     }
   *   }
   * );
   * 
   * @example
   * // Contoh lengkap dalam struk
   * printer.connectToPrint({
   *   onReady: async (print) => {
   *     // Cetak logo
   *     await print.putImageWithUrl("https://example.com/logo.png", {
   *       align: "center"
   *     });
   *     await print.writeLineBreak();
   *     
   *     // Cetak header
   *     await print.writeText("TOKO SAYA", { align: "center", bold: true });
   *     await print.writeDashLine();
   *     
   *     // ... struk lainnya
   *   },
   *   onFailed: (message) => alert(message)
   * });
   */
  async putImageWithUrl(
    url: string,
    options: {
      align?: string;
      onFailed?: (message: string) => void;
    } = {}
  ): Promise<void> {
    const { onFailed } = options;
    const align = options.align || "left";

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = url;
      });

      await this.printImageData(img, align);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to print image";
      if (onFailed) {
        onFailed(errorMessage);
      } else {
        throw new Error(errorMessage);
      }
    }
  }

  /**
   * Mencetak QR Code dari text/data
   * QR Code berguna untuk payment (QRIS), URL, tracking, dll
   * 
   * @param {string} text - Text/data untuk di-encode ke QR Code
   * @param {Object} [options] - Opsi untuk QR Code
   * @param {string} [options.size="medium"] - Ukuran QR: "small" (100px), "medium" (200px), "large" (300px)
   * @param {string} [options.align="center"] - Alignment: "left", "center", "right"
   * @param {string} [options.errorCorrection="M"] - Error correction level: "L", "M", "Q", "H"
   * @param {Function} [options.onFailed] - Callback jika gagal
   * 
   * @example
   * // QR Code sederhana untuk URL
   * await print.printQRCode("https://example.com");
   * 
   * @example
   * // QR Code untuk QRIS Payment
   * await print.printQRCode(qrisData, {
   *   size: "large",
   *   align: "center",
   *   errorCorrection: "M"
   * });
   * 
   * @example
   * // QR Code dengan error handling
   * await print.printQRCode("ORDER-12345", {
   *   size: "medium",
   *   align: "center",
   *   onFailed: (message) => {
   *     console.error("Gagal cetak QR:", message);
   *     alert(message);
   *   }
   * });
   * 
   * @example
   * // Contoh lengkap: Struk dengan QR Payment
   * printer.connectToPrint({
   *   onReady: async (print) => {
   *     await print.writeText("TOKO SAYA", { align: "center", bold: true });
   *     await print.writeDashLine();
   *     await print.writeTextWith2Column("Total", "Rp 50.000");
   *     await print.writeDashLine();
   *     
   *     // QR untuk payment
   *     await print.writeText("SCAN UNTUK BAYAR", { align: "center", bold: true });
   *     await print.writeLineBreak();
   *     await print.printQRCode(qrisData, {
   *       size: "large",
   *       align: "center"
   *     });
   *     
   *     await print.writeLineBreak({ count: 3 });
   *   },
   *   onFailed: (message) => alert(message)
   * });
   */
  async printQRCode(
    text: string,
    options: {
      size?: "small" | "medium" | "large";
      align?: string;
      errorCorrection?: "L" | "M" | "Q" | "H";
      onFailed?: (message: string) => void;
    } = {}
  ): Promise<void> {
    const { 
      size = "medium", 
      align = "center",
      errorCorrection = "M",
      onFailed 
    } = options;

    try {
      // Tentukan ukuran dalam pixel
      const sizeMap = {
        small: 100,
        medium: 200,
        large: 300
      };
      const qrSize = sizeMap[size];

      // Generate QR Code ke canvas
      const canvas = document.createElement("canvas");
      await QRCode.toCanvas(canvas, text, {
        width: qrSize,
        margin: 1,
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      });

      // Print QR Code dari canvas
      await this.printImageData(canvas, align);

    } catch (error: any) {
      const errorMessage = error.message || "Failed to generate or print QR Code";
      if (onFailed) {
        onFailed(errorMessage);
      } else {
        throw new Error(errorMessage);
      }
    }
  }

  /**
   * Mencetak Barcode dari text/data
   * Support berbagai format: CODE128, EAN13, UPC, CODE39, ITF14, dll
   * 
   * @param {string} text - Text/data untuk di-encode ke Barcode
   * @param {Object} [options] - Opsi untuk Barcode
   * @param {string} [options.format="CODE128"] - Format barcode: "CODE128", "EAN13", "UPC", "CODE39", "ITF14", dll
   * @param {number} [options.width=2] - Lebar garis barcode (1-4)
   * @param {number} [options.height=50] - Tinggi barcode dalam pixels
   * @param {boolean} [options.displayValue=true] - Tampilkan text di bawah barcode
   * @param {string} [options.align="center"] - Alignment: "left", "center", "right"
   * @param {Function} [options.onFailed] - Callback jika gagal
   * 
   * @example
   * // Barcode sederhana
   * await print.printBarcode("1234567890");
   * 
   * @example
   * // Barcode dengan format EAN13
   * await print.printBarcode("5901234123457", {
   *   format: "EAN13",
   *   height: 60,
   *   displayValue: true,
   *   align: "center"
   * });
   * 
   * @example
   * // Barcode untuk produk
   * await print.printBarcode(productCode, {
   *   format: "CODE128",
   *   width: 2,
   *   height: 50,
   *   displayValue: true
   * });
   * 
   * @example
   * // Barcode dengan error handling
   * await print.printBarcode("ABC123", {
   *   format: "CODE39",
   *   onFailed: (message) => {
   *     console.error("Barcode error:", message);
   *     alert(message);
   *   }
   * });
   * 
   * @example
   * // Contoh lengkap: Invoice dengan barcode
   * printer.connectToPrint({
   *   onReady: async (print) => {
   *     await print.writeText("INVOICE", { align: "center", bold: true });
   *     await print.writeDashLine();
   *     
   *     await print.writeTextWith2Column("No Invoice", "INV-001");
   *     await print.writeTextWith2Column("Tanggal", "06/10/2024");
   *     await print.writeDashLine();
   *     
   *     // Barcode invoice
   *     await print.printBarcode("INV001", {
   *       format: "CODE128",
   *       height: 50,
   *       displayValue: true,
   *       align: "center"
   *     });
   *     
   *     await print.writeLineBreak({ count: 3 });
   *   },
   *   onFailed: (message) => alert(message)
   * });
   */
  async printBarcode(
    text: string,
    options: {
      format?: "CODE128" | "CODE39" | "EAN13" | "EAN8" | "UPC" | "ITF14" | "MSI" | "pharmacode" | "codabar";
      width?: number;
      height?: number;
      displayValue?: boolean;
      align?: string;
      onFailed?: (message: string) => void;
    } = {}
  ): Promise<void> {
    const {
      format = "CODE128",
      width = 2,
      height = 60,
      displayValue = true,
      align = "center",
      onFailed
    } = options;

    try {
      // Hitung lebar optimal berdasarkan paper size
      // 58mm = ~384 pixels, 80mm = ~576 pixels di 203 DPI
      const maxWidth = this.paperSize === "58" ? 380 : 570;
      
      // Create canvas for barcode dengan ukuran yang lebih besar
      const canvas = document.createElement("canvas");
      
      // Generate barcode dengan ukuran penuh
      JsBarcode(canvas, text, {
        format: format,
        width: width,
        height: height,
        displayValue: displayValue,
        margin: 10,
        background: "#ffffff",
        lineColor: "#000000",
        fontSize: 14,
        textMargin: 5
      });

      // Pastikan barcode tidak melebihi lebar maksimal
      if (canvas.width > maxWidth) {
        // Scale down jika terlalu lebar
        const scale = maxWidth / canvas.width;
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = maxWidth;
        tempCanvas.height = canvas.height * scale;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
          // Print barcode dari scaled canvas
          await this.printBarcodeImage(tempCanvas, align);
        }
      } else {
        // Print barcode dengan ukuran original
        await this.printBarcodeImage(canvas, align);
      }

    } catch (error: any) {
      const errorMessage = error.message || "Failed to generate or print Barcode";
      if (onFailed) {
        onFailed(errorMessage);
      } else {
        throw new Error(errorMessage);
      }
    }
  }

  /**
   * Method khusus untuk print barcode image
   * Tidak resize seperti printImageData, maintain aspect ratio
   * 
   * @private
   * @param {HTMLCanvasElement} canvas - Canvas yang berisi barcode
   * @param {string} align - Alignment: "left", "center", "right"
   */
  private async printBarcodeImage(
    canvas: HTMLCanvasElement,
    align: string = "center"
  ): Promise<void> {
    const device = this.printChar;
    if (!device) {
      throw new Error("Printer not connected");
    }

    // Set alignment
    if (align === "center") {
      await (device as BluetoothRemoteGATTCharacteristic).writeValue(
        this.center.buffer as ArrayBuffer
      );
    } else if (align === "right") {
      await (device as BluetoothRemoteGATTCharacteristic).writeValue(
        this.right.buffer as ArrayBuffer
      );
    } else {
      await (device as BluetoothRemoteGATTCharacteristic).writeValue(
        this.left.buffer as ArrayBuffer
      );
    }

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get canvas context");
    }

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    
    // Convert ke monochrome
    const threshold = 128;
    const width = canvas.width;
    const height = canvas.height;
    
    // ESC/POS image commands
    const widthBytes = Math.ceil(width / 8);
    const header = new Uint8Array([
      0x1d, 0x76, 0x30, 0x00, // GS v 0
      widthBytes & 0xff, (widthBytes >> 8) & 0xff, // width in bytes
      height & 0xff, (height >> 8) & 0xff // height
    ]);

    // Convert image to bitmap
    const bitmap = new Uint8Array(widthBytes * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
        const r = imageData[pixelIndex];
        const g = imageData[pixelIndex + 1];
        const b = imageData[pixelIndex + 2];
        const gray = (r + g + b) / 3;
        
        if (gray < threshold) {
          const byteIndex = y * widthBytes + Math.floor(x / 8);
          const bitIndex = 7 - (x % 8);
          bitmap[byteIndex] |= 1 << bitIndex;
        }
      }
    }

    // Combine header and bitmap
    const fullData = new Uint8Array(header.length + bitmap.length);
    fullData.set(header, 0);
    fullData.set(bitmap, header.length);

    // Send to printer
    if (this.printerType === "usb") {
      await this.sendImageDataUsb(fullData);
    } else {
      await this.sendImageDataBluetooth(fullData);
    }

    // Reset alignment
    await (device as BluetoothRemoteGATTCharacteristic).writeValue(
      this.left.buffer as ArrayBuffer
    );
  }
}

/**
 * Export untuk penggunaan via CDN
 * Digunakan sebagai: new PrintHub.init({ ... })
 * 
 * @example
 * // Via CDN
 * <script src="https://cdn.jsdelivr.net/npm/printhub@latest/dist/index.global.js"></script>
 * <script>
 *   const printer = new PrintHub.init({ paperSize: "80" });
 * </script>
 */
export const init = PrintHub;

/**
 * Export default untuk penggunaan via NPM/ES6
 * Digunakan sebagai: new PrintHub({ ... })
 * 
 * @example
 * // Via NPM (ES6)
 * import PrintHub from "printhub";
 * const printer = new PrintHub({ paperSize: "80", printerType: "bluetooth" });
 * 
 * @example
 * // Via NPM (CommonJS)
 * const PrintHub = require("printhub");
 * const printer = new PrintHub({ paperSize: "58" });
 */
export default PrintHub;
