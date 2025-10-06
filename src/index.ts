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
      await charp.writeValue(this.left);
      await charp.writeValue(this.normalSize);
      await charp.writeValue(this.boldOff);
      await charp.writeValue(this.underlineOff);
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
    if (bold) await device.writeValue(this.boldOn);
    if (underline) await device.writeValue(this.underlineOn);

    if (align === "center") {
      await device.writeValue(this.center);
    } else if (align === "right") {
      await device.writeValue(this.right);
    }

    if (size === "double") await device.writeValue(this.doubleSize);

    await device.writeValue(this.encoder.encode(text));
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
            this.boldOn
          );
        }

        if (underline) {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.underlineOn
          );
        }

        if (align === "center") {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.center
          );
        } else if (align === "right") {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.right
          );
        } else {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.left
          );
        }

        if (size === "double") {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.doubleSize
          );
        }

        await (device as BluetoothRemoteGATTCharacteristic).writeValue(
          this.encoder.encode(text)
        );
        await this.setDefault(device as BluetoothRemoteGATTCharacteristic);
        await this.writeLineBreak();
      }
    }
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
        this.center
      );
    } else if (align === "right") {
      await (device as BluetoothRemoteGATTCharacteristic).writeValue(
        this.right
      );
    } else {
      await (device as BluetoothRemoteGATTCharacteristic).writeValue(this.left);
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
      await device.writeValue(chunk);
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
    await device.transferOut(usbEndPoint.endpointNumber, data);
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
