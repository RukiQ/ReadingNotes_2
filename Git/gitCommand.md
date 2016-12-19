### 创建版本库
`mkdir` : 在当前目录创建空目录，即空的Git仓库

`pwd` : 显示当前目录

`git init` : 初始化一个仓库，把当前目录变成Git可以管理的仓库（会产生`.git`的目录，这个目录是Git来跟踪管理版本库的，默认隐藏）

`ls -ah` : 显示隐藏的目录

`git add` : 把文件添加到仓库缓存区（Index），临时保存改动

`git add *` : 把所有文件添加到缓存区

`git commit -m "wrote a readme file"` : 把文件提交到仓库（HEAD），指向最近一次提交后的结果，但是还没到远端仓库。`-m` 后面输入的是本次提交的说明

- 为什么Git需要`add`，`commit`两步？：因为`commit`可以一次提交很多文件（提交到仓库），所以可以`add`不同的文件（添加到缓存区）

---
### 时光机穿梭
`git status` : 查看结果

`git diff` ： 查看修改的内容
#### 1）版本回退

`git log` ： 显示从最近到最远的提交日志（其中会带上版本号`commit id`，每个人的都不一样）

`git log --pretty=oneline` ： 显示简单的提交日志

`git reset --hard HEAD^` ： 回退到上一个版本（`HEAD`指向当前版本，`HEAD^^`指向上上个版本，`HEAD~100`指向之前100个版本）

`git reset --hard commit-id` ： 恢复到某一个版本（`commit id`不必全写，写前几位即可）

`git reflog` ： 记录操作的每一次命令

#### 2）工作区和暂存区
 工作区：在电脑里的目录；版本库：隐藏的`.git`目录，Git的版本库里存了很多东西，其中最重要的就是称为stage（index）的暂存区，还有Git为我们自动创建的第一个分支	`master`，以及指向`master`的一个指针叫`HEAD`

#### 3） 管理修改
`cat readme.txt` ： 查看文件内容

`git diff HEAD -- readme.txt` ： 查看工作区和版本库里面最新版本的区别

- 每次修改，如果不`add`到暂存区，那就不会加入到`commit`中

#### 4）撤销修改
`git checkout -- file` ： 丢弃工作区的修改，即把文件在工作区的修改全部撤销

`git reset HEAD file` ： 把暂存区的修改撤销掉，重新放回工作区

`git reset` ： 既可以回退版本，也可以把暂存区的修改回退到工作区。当我们用`HEAD`时，表示最新的版本
#### 5）删除文件
`rm file` ： 工作区删除文件

`git rm file` ： 从版本库中删除该文件

`git checkout -- file` ： 从版本库里的版本替换工作区的版本，无论工作区是修改还是删除，都可以“一键还原”

---
### 远程仓库
Git 是分布式版本控制系统，同一个 Git 仓库，可以分布到不同的机器上

`ssh-keygen -t rsa -C "youremail@example.com"` ： 在用户主目录下创建SSH Key

`.ssh` 目录里面有`id_rsa`和`id_rsa.pub`两个文件，这两个就是SSH Key的密钥对，`id_rsa`是私钥，不能泄露出去，`id_rsa.pub`是公钥，可以放心地告诉别人

- 为什么GitHub需要SSH Key？：因为GitHub需要识别出你推送的提交确实是你推送的，而不是别人冒充的，而Git支持SSH协议，所以，GitHub只要知道了你的公钥，就可以确认只有你自己才能推送。
- GitHub允许你在不同电脑上添加多个key。

#### 1）添加远程库（先有本地库，后有远程库）
`git remote add origin git@github.com:userName/learngit.git` ： 将本地仓库和远程库进行关联。`origin`：远程库的名字，这是Git默认的叫法。

`git push` ： 把当前分支`master`推送到远程

`git push -u origin master` ： 第一次推送`master`分支时，由于远程库是空的，加上`-u`参数，Git不但会把本地的`master`分支内容推送到远程新的`master`分支，还会把本地的`master`分支和远程的`master`分支关联起来，在以后的推送或者拉取时就可以简化命令。

`git push origin master` ： 在第一次推送之后，可以用该命令把本地`master`分支的最新修改推送至GitHub

- 分布式版本系统的最大好处之一：在本地工作完全不需要考虑远程库的存在，有无联网都可以正常工作，而SVN在没有联网的时候则不能干活。
- 提示出错信息：fatal: remote origin already exists.——>解决方案：`git remote rm origin`

#### 2）从远程库克隆（先有远程库，然后克隆到本地）
`git clone git@github.com/userName/gitskills.git` ： 克隆一个本地库

- Git支持多种协议，默认的`git://`使用ssh，速度最快，但也可以使用`https`等其他协议。
- 使用`https`除了速度慢以外，还有个最大的麻烦就是每次推送都必须输入口令，但是在某些只开放http端口的公司内部就无法使用`ssh`协议而只能使用`https`

---
### 分支管理
- Git的分支，无论创建、切换和删除，都能在1秒之内完成。无论你的版本库是1个文件还是1万个文件！

#### 1）创建于合并分支
- `master`是主分支；`HEAD`指向`master`，即当前分支；`master`指向提交，每次提交，`master`分支都会向前移动一步，这样，随着你不断提交，`master`分支的线也越来越长。
- 创建新的分支`dev`：Git新建了一个指针叫`dev`，指向`master`相同的提交，再把`HEAD`指向`dev`，就表示当前分支在`dev`上。
- 合并分支：把`master`指向`dev`的当前提交。
- 合并完分支后，可以删除`dev`分支，即把`dev`指针给删除，就只剩下一条`master`分支

`git branch` ： 查看当前分支，会列出所有分支，当前分支前面会标一个`*`号

`git branch <name>` ： 创建分支

`git checkout <name>` ： 切换分支

`git checkout -b <name>` ： 创建`<name>`分支，然后切换到`<name>`分支（创建+切换分支）

`git merge <name>` ： 合并指定分支(<name>)到当前分支(`master`)（首先要切换到`master`主分支作为当前分支）

`git branch -d <name>` ： 删除分支

#### 2）解决冲突

`git log --graph` ： 查看分支合并图

`git log --graph --pretty=oneline --abbrev-commit` ： 查看简单分支合并图

- 当Git无法自动合并分支时，就必须首先解决冲突。解决冲突后，再提交，合并完成。
- Git用 `<<<<<<<`，`=======`，`>>>>>>>` 标记出不同分支的内容

#### 3）分支管理策略

- 通常，合并分支时，如果可能，Git会用`Fast forward`模式，但这种模式下，删除分支后，会丢掉分支信息。

- 如果要强制禁用`Fast forward`模式，Git就会在merge时生成一个新的commit，这样，从分支历史上就可以看出分支信息。

`git merge --no-ff -m "merge with no-ff" <name>` ： `no-ff` 参数表示禁用 `Fast forward`，可以用普通模式合并，合并后的历史有分支，能看出来曾经做过合并。

- 在实际开发中，我们应该按照<b>几个基本原则</b>进行分支管理：

- （1）master分支：应该是非常稳定的，也就是仅用来发布新版本，平时不能在上面干活；

- （2）dev分支：用来干活的，dev分支是不稳定的，到某个时候，比如1.0版本发布时，再把dev分支合并到master上，在master分支发布1.0版本；

- （3）你和你的小伙伴们每个人都在dev分支上干活，每个人都有自己的分支，时不时地往dev分支上合并就可以了。

#### 4）Bug分支

- 在Git中，每个bug都可以通过一个新的临时分支来修复，修复后，合并分支，然后将临时分支删除。

`git stash` ： 把当前工作现场“储藏”起来，等以后恢复现场后继续工作

`git stash list` ： 查看刚才的工作现场

`git stash apply` ： 回复工作现场

`git stash drop` ： 删除stash内容

`git stash pop` ： 回复的同时把stash内容也删了

`git stash apply stash@{0}` ： 回复指定的stash

#### 5）Feature分支

`git branch -D <name>` ： 强行删除分支

- 开发一个新feature，最好新建一个分支；
- 如果要丢弃一个没有被合并过的分支，可以通过命令强行删除

#### 6）多人协作
- 当你从远程仓库克隆时，实际上Git自动把本地`master`分支和远程的`master`分支对应起来了，并且，远程仓库的默认名称是`origin`

`git remote` ： 查看远程库

`git remote -v` ： 查看更详细的远程库信息

`git push origin branch-name` ： 推送分支，把该分支上的所有本地提交推送到远程库

- 需要时刻与远程同步的分支：`master`主分支和`dev`开发分支

`git checkout -b dev origin/dev` ： 创建远程`origin`的`dev`分支到本地

`git pull` ： 从远程抓取分支

`git branch --set-upstram dev orign/branch-name` ： 如果`git pull`提示“no tracking information”，说明本地分支和远程分支的链接关系没有创建，该命令用于设置`branch-name`和`origin/branch-name`的链接

---
### 标签管理
#### 1）创建标签
`git tag <name>` ： 用于新建一个标签，默认为`HEAD`，也可以指定一个commit id

`git tag <name> <commit-id>` ： 在对应的commit id上打标签

`git tag -a <tagname> -m "blablabla..." 3628164` : 指定标签信息， `-a`指定标签名，`-m`指定说明文字

`git tag -s <tagname> -m "blablabla..." 3628164` : `-s`用私钥签名一个标签，可以用PGP签名标签

`git tag` ： 查看所有标签

`git show <tagname>` ： 查看标签信息

- 默认标签是打在最新提交的commit上的
- 标签不是按时间顺序列出，而是按字母排序的

#### 2）操作标签
`git tag -d <tagname>` ： 删除标签

`git push origin <tagname>` ： 推送某个本地标签到远程

`git push origin --tags` ： 一次性推送尚未推送到远程的本地标签

`git push origin :refs/tags/<tagname>` ： 删除一个远程标签

---

### 自定义Git

`git config --global alias <alias> <command>` ： 给命令`<command>`起别名`<alias>`

- 配置Git的时候，加上`--global`是针对当前用户起作用的，如果不加，那只针对当前的仓库起作用。
- 每个仓库的配置文件都放在`.git/config`文件夹中