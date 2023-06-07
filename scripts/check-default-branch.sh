#!/usr/bin/env bash

# 실행권한을 부여해야 스크립트를 실행할 수 있습니다 
# chmod +x ./add-issue-to-commit.sh

branch_name=`git rev-parse --abbrev-ref HEAD`

if [ "$branch_name" == "main" ]; then
	echo "main 브랜치는 default 브랜치로 commit, push가 불가능합니다."
	exit 1
elif [ "$branch_name" == "develop" ]; then
    echo "develop 브랜치는 default 브랜치로 commit, push가 불가능합니다."
	exit 1
fi

exit 0
