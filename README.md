<!-- markdownlint-disable MD033 MD041 MD045 -->

<div align="center">

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/S6S8L8OOP)
[![爱发电](https://img.shields.io/badge/%E7%88%B1%E5%8F%91%E7%94%B5_Afdian-946CE6?style=for-the-badge)](https://ifdian.net/a/SharpIce)

</div>

<hr>

## 命令

### 1.help

Display help information

usage: `Kiwi help`

Similar commands: `--help`、`-h`

### 2.version

Display version information

usage: `Kiwi version`

Similar commands: `--version`、`-v`

### 3.config

Add, modify, and delete configuration items

usage: `Kiwi config [Subcommands] [Options]`

Subcommands:

- add - Add configuration items. Of course, it can also be used to modify configuration items. For example: `Kiwi config add icon=false logging="debug" ...`
- delete - Add configuration items, for example: `Kiwi config delete icon logging ...`
- list - List all configuration items

Related configurations:

| Configuration item |  Type   |              Description               | Default value |
| :----------------: | :-----: | :------------------------------------: | :-----------: |
|      iconText      | Boolean | Whether to include icons in the output |     true      |
|     colorText      | Boolean |   Whether to output colored content    |     true      |
|  SponsorshipTips   | Boolean |  Whether to display sponsorship tips   |     true      |
|      language      | string  |            Set the language            |     en_us     |

### 4.brotli

Unzip/compress brotli compressed files with the suffix ‘.br’, such as `system.new.dat.br` or `vendor.new.dat.br` files

usage: `Kiwi brotli [Options] [Path] -o [Path]`

example:

- Unzip: `Kiwi brotli -u /path/vendor.new.dat.br -o /path/vendor.img`
- Compression: `Kiwi brotli -c /path/vendor.img -o /path/vendor.new.dat.br`

Options:

- `-u` Unzip
- `-c` Compression
- `-o` Output location
- `--level` Compression level, range: 0-11, default: 0, recommended 3~5

### 5.transfer2img

Convert the file with the suffix `*.new.dat` and `*.transfer.list` to an img file, for example `system.new.dat` and `system.transfer.list`

usage: `Kiwi transfer2img [*.new.dat file path] [*.transfer.list file path] [output path]`

Example: `Kiwi transfer2img /path/vendor.new.dat /path/vendor.transfer.list /path/vendor.img`

### 6.vbmeta

vbmeta related tools

usage: `Kiwi vbmeta [Subcommands] [vbmeta file path]`

Subcommands:

- info - Get vbmeta information
- disable_verify - Disable AVB verification for vbmeta files

### 7.check

Check whether the operating environment is compatible

usage: `Kiwi check`
