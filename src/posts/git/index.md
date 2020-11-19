# How to start with Git

## Setting up

### Setting up a repo by cloning

```bash
git clone https://github.com/rails/rails.git
```

### Setting up a repo starting with a local
origin is the remote name
master is the remote branch
```bash
git init   # 1. create a local repo
git remote add origin https://.../repo.git   # 2. add a remote repo
git checkout origin/master # 3. checkout to remote repo
```


## Pull - Get changes from remote repo
```bash
git pull
```


## Push - Send changes to remote repo
```bash
git add *                # 1. add files to a local stage
git commit -m "message"  # 2. commit staged files to the local repo
git push                 # 3. push local to remote repo
```

## Merge conflict with unrelated histories
Ein bestehendes lokales Git-Repo soll mit einem Remote-Repo gemerged werden:

### Commit local repo:
```bash
git add *
git commit -m "message"
```

### Checkout to remote-repo:
```bash
git checkout master
git merge localmaster --allow-unrelated-histories
git add *
git commit -m "resolved merge conflict"
```

## Checkout a new branch, then merge
git checkout -b experiment
git add *
git commit -m "message"
git checkout master
git merge experiment




## Last changes of a file

```bash
git log --oneline README.md
```

Result:
```bash
$ git log --oneline README.md
88740d8 (HEAD -> main, origin/main) resolved merge conflict
2d63319 (mylocalbranch) some changes
6a1816c initial commit
```


## Untrack files

```bash
git rm --cached <file>
git rm -r --cached <folder>

git add .
git commit -m ".gitignore fix"
git push
```
