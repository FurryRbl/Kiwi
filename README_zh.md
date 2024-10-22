<!-- markdownlint-disable MD033 MD041 MD045 -->

<div align="center">

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/S6S8L8OOP)
[![爱发电](https://img.shields.io/badge/%E7%88%B1%E5%8F%91%E7%94%B5_Afdian-946CE6?style=for-the-badge)](https://ifdian.net/a/SharpIce)

</div>

<hr>

## 命令

### 1.help

显示帮助信息

用法：`Kiwi help`

相似命令：`--help`、`-h`

### 2.version

显示版本信息

用法：`Kiwi version`

相似命令：`--version`、`-v`

### 3.config

添加、修改、删除配置项

用法：`Kiwi config [子命令] [选项]`

子命令：

- add - 添加配置项，当然也可以用于修改配置项，例：`Kiwi config add icon=false logging="debug" ...`
- delete - 添加配置项，例：`Kiwi config delete icon logging ...`
- list - 列出所有的配置项

相关配置：

|     配置项      |  类型   |         说明         | 默认值  |
| :-------------: | :-----: | :------------------: | :-----: |
|    iconText     | Boolean | 是否在输出中包含图标 |  true   |
|    colorText    | Boolean |   是否输出彩色内容   |  true   |
| SponsorshipTips | Boolean |   是否显示赞助提示   |  true   |
|    language     | string  |       设置语言       | 'en_us' |

### 4.brotli

解压/压缩后缀为 ‘.br’ 的 brotli 压缩文件，例如`system.new.dat.br`或者`vendor.new.dat.br`文件

用法：`Kiwi brotli [选项] [位置] -o [位置]`

例：

- 解压： `Kiwi brotli -u /path/vendor.new.dat.br -o /path/vendor.img`
- 压缩： `Kiwi brotli -c /path/vendor.img -o /path/vendor.new.dat.br`

选项：

- `-u` 解压
- `-c` 压缩
- `-o` 输出位置
- `--level` 压缩等级，范围：0-11，默认：0，推荐3~5

### 5.transfer2img

将后缀为`*.new.dat`的文件结合`*.transfer.list`文件转换为img文件，例如`system.new.dat`和`system.transfer.list`

用法：`Kiwi transfer2img [*.new.dat 文件路径] [*.transfer.list 文件路径] [输出路径]`

例： `Kiwi transfer2img /path/vendor.new.dat /path/vendor.transfer.list /path/vendor.img`

### 6.vbmeta

vbmeta 的相关工具

用法：`Kiwi vbmeta [命令] [vbmeta文件路径]`

子命令：

- info - 获取 vbmeta 信息
- disable_verify - 为 vbmeta 文件禁用 AVB 验证

### 7.check

检查运行环境是否兼容

用法：`Kiwi check`
