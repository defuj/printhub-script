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

  setPaperSize(paperSize: string) {
    this.paperSize = paperSize;
  }

  async checkBluetooth(): Promise<boolean> {
    return navigator.bluetooth.getAvailability();
  }

  async setDefault(charp: BluetoothRemoteGATTCharacteristic) {
    if (charp) {
      await charp.writeValue(this.left.buffer);
      await charp.writeValue(this.normalSize.buffer);
      await charp.writeValue(this.boldOff.buffer);
      await charp.writeValue(this.underlineOff.buffer);
    }
  }

  async writeLineBreak({ count = 1 }: { count?: number } = {}) {
    if (this.printChar) {
      if (this.printerType === "usb") {
        for (let i = 0; i < count; i++) {
          const textData = [0x0a];
          try {
            const usbConfig = (this.printChar as USBDevice).configuration;
            if (usbConfig) {
              const usbEndPoints =
                usbConfig.interfaces[0].alternate.endpoints.find(
                  (endpoint) => endpoint.direction === "out"
                );
              if (usbEndPoints) {
                await (this.printChar as USBDevice).transferOut(
                  usbEndPoints.endpointNumber,
                  new Uint8Array(textData)
                );
                console.log("Data sent to USB printer.");
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
        }
      } else {
        for (let i = 0; i < count; i++) {
          await (
            this.printChar as BluetoothRemoteGATTCharacteristic
          ).writeValue(new Uint8Array([10]).buffer);
        }
      }
    }
  }

  async writeDashLine() {
    if (this.printChar) {
      if (this.printerType === "usb") {
        const textData = [
          ...this.encoder.encode("-".repeat(this.paperSize === "58" ? 32 : 42)),
        ];
        try {
          const usbConfig = (this.printChar as USBDevice).configuration;
          if (usbConfig) {
            const usbEndPoints =
              usbConfig.interfaces[0].alternate.endpoints.find(
                (endpoint) => endpoint.direction === "out"
              );
            if (usbEndPoints) {
              await (this.printChar as USBDevice).transferOut(
                usbEndPoints.endpointNumber,
                new Uint8Array(textData)
              );
              console.log("Data sent to USB printer.");
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
        await (this.printChar as BluetoothRemoteGATTCharacteristic).writeValue(
          this.encoder.encode("-".repeat(this.paperSize === "58" ? 32 : 42))
        );
      }
      await this.writeLineBreak();
    }
  }

  async writeTextWith2Column(
    text1: string,
    text2: string,
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
          bold ? 0x8 : 0x0,
          0x1b,
          0x2d,
          underline ? 0x1 : 0x0, // Set underline
          0x1b,
          0x61, // Alignment
          align === "center" ? 0x1 : align === "right" ? 0x2 : 0x0,
          0x1d,
          0x21,
          size === "double" ? 0x11 : 0x0, // Set size
          ...this.encoder.encode(this.createItemData(text1, text2)), // Add text data
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
              console.log("Data sent to USB printer.");
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
            this.boldOn.buffer
          );
        }

        if (underline) {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.underlineOn.buffer
          );
        }

        if (align === "center") {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.center.buffer
          );
        } else if (align === "right") {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.right.buffer
          );
        }

        if (size === "double") {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.doubleSize.buffer
          );
        }

        await (device as BluetoothRemoteGATTCharacteristic).writeValue(
          this.encoder.encode(this.createItemData(text1, text2))
        );
        await this.setDefault(device as BluetoothRemoteGATTCharacteristic);
        await this.writeLineBreak();
      }
    }
  }

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
              console.log("Data sent to USB printer.");
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
            this.boldOn.buffer
          );
        }

        if (underline) {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.underlineOn.buffer
          );
        }

        if (align === "center") {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.center.buffer
          );
        } else if (align === "right") {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.right.buffer
          );
        } else {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.left.buffer
          );
        }

        if (size === "double") {
          await (device as BluetoothRemoteGATTCharacteristic).writeValue(
            this.doubleSize.buffer
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

  async connectToPrint({
    onReady,
    onFailed,
  }: {
    onReady: (printer: PrintHub) => void;
    onFailed: (message: string) => void;
  }) {
    try {
      if (this.printerType === "usb") {
        await navigator.usb
          .requestDevice({ filters: [] })
          .then(async (device) => {
            await device.open();
            await device.selectConfiguration(1);
            await device.claimInterface(0);
            this.printChar = device;
            onReady(this);
          })
          .catch((error) => {
            onFailed(error.message);
          });
      } else if (this.printerType === "bluetooth") {
        if (await this.checkBluetooth()) {
          if (this.printChar == null) {
            navigator.bluetooth
              .requestDevice({
                filters: [
                  {
                    services: ["000018f0-0000-1000-8000-00805f9b34fb"],
                  },
                ],
              })
              .then((device) => {
                if (device.gatt) {
                  return device.gatt.connect();
                } else {
                  throw new Error("Device not found");
                }
              })
              .then((server) => {
                return server.getPrimaryService(
                  "000018f0-0000-1000-8000-00805f9b34fb"
                );
              })
              .then((service) => {
                return service.getCharacteristics();
              })
              .then((characteristics) => {
                let writableCharacteristic: BluetoothRemoteGATTCharacteristic | null =
                  null;
                characteristics.forEach((characteristic) => {
                  console.log("Characteristic UUID: " + characteristic.uuid);
                  if (characteristic.properties.write) {
                    writableCharacteristic = characteristic;
                    this.printChar = writableCharacteristic;
                  }
                });
                if (writableCharacteristic) {
                  onReady(this);
                } else {
                  onFailed("No writable characteristic found.");
                }
              })
              .catch((error) => {
                onFailed(error.message);
              });
          } else {
            onReady(this);
          }
        } else {
          onFailed(
            "Perangkat Anda tidak mendukung untuk melakukan print dengan Bluetooth"
          );
        }
      } else {
        onFailed("Printer type not supported.");
      }
    } catch (error) {
      onFailed("Failed to connect to printer");
    }
  }

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
}

export const init = PrintHub;

export default PrintHub;
