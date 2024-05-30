# 奇异果——Android系统工具箱

## 命令

### help

显示帮助信息

相同命令：`--help`、`-h`

使用：`Kiwi help`

### version

显示版本信息

相同命令：`--version`、`-v`

使用：`Kiwi version`

### config

添加、修改、移除配置项

子命令：

- add 添加配置项，当然也可以用于修改配置项，例：`Kiwi config add icon=false logging="debug" ...`
- delete 添加配置项，例：`Kiwi config delete icon logging ...`
- list 列出所有的配置项

目前支持的配置：

- icon 输出是否包含图标
- logging 输出的日志等级
