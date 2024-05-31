# 奇异果——Android系统工具箱

## 命令

### help

显示帮助信息

相同命令：`--help`、`-h`

用法：`Kiwi help`

### version

显示版本信息

相同命令：`--version`、`-v`

用法：`Kiwi version`

### config

添加、修改、移除配置项

子命令：

- add 添加配置项，当然也可以用于修改配置项，例：`Kiwi config add icon=false logging="debug" ...`
- delete 添加配置项，例：`Kiwi config delete icon logging ...`
- list 列出所有的配置项

目前支持的配置：

- icon 输出是否包含图标
- logging 输出的日志等级

### brotli

解压/压缩后缀为 ‘.br’ 的 brotli 压缩文件，例如`vendor.new.dat.br`

用法：`Kiwi brotli [选项] [位置] -o [位置]`

例：

- 解压： `Kiwi brotli -u /path/vendor.new.dat.br -o /path/vendor.img`
- 压缩： `Kiwi brotli -c /path/vendor.img -o /path/vendor.new.dat.br`

选项：

- `-u` 解压
- `-c` 压缩
- `-o` 输出位置
- `--level` 压缩等级，范围：0-11，默认：0，推荐3~5
