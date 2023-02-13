@REM echo %cd%
@REM echo on 
@REM Windows 系统 管理员身份 开机自启动
@REM Windows + R 输入 shell:startup 打开开机启动文件夹
@REM 创建本文件的快捷方式 放到开机启动文件夹
@REM 选择快捷方式 右键选择属性 点击高级按钮 在弹窗中选中 用管理员身份运行 确定

@REM cd /d F:/icu
@REM pause
@REM npm run devp

@REM cd /d F:/icu

@REM start C:\"Program Files"\Git\git-bash.exe -c "cd F:icu && npm run dev --login -i"
start C:\"Program Files"\Git\git-bash.exe -c "cd F:icu && npm run dev"