#!/usr/bin/env bash

# [Git Hook] commit prefix 
# Commit 시 Branch 의 issue number를 자동으로 커밋 메세지에 삽입
# [Rule]
# branch name: common/123_XXXX -> common [#123] test
# branch name: app/123_XXXX -> app [#123] test
# branch name: server/123_XXXX -> server [#123] test
# branch name: packages/123_XXXX -> packages [#123] test

# 실행권한을 부여해야 스크립트를 실행할 수 있습니다 
# chmod +x ./add-issue-to-commit.sh

COMMIT_MSG_FILE=$1

branch_name=`git rev-parse --abbrev-ref HEAD`
branch_prefix=`echo ${branch_name} | cut -f1 -d '/'`
issue_number1=`echo ${branch_name} | cut -f2 -d '/' | cut -f1 -d '_'`
issue_number2=`echo ${branch_name} | cut -f2 -d '/' | cut -f1 -d '-'`
first_line=`head -n1 ${COMMIT_MSG_FILE}`

number_re='^[0-9]+$'
issue_re='#[0-9]+'

if [[ $issue_number1 =~ $number_re ]]; then
    issue_number=$issue_number1
elif [[ $issue_number2 =~ $number_re ]]; then
    issue_number=$issue_number2
fi

echo Issue number: $issue_number
echo COMMIT_MSG_FILE: $COMMIT_MSG_FILE # COMMIT_MSG_FILE: .git/COMMIT_EDITMSG
echo first_line: $first_line

repo='oneweek-template'

web='web'
app='app'
server='server'
pkg='pkg'
package='package'
packages='packages'

common="common"
feature="feature"

if [[ $issue_number =~ $number_re ]];
then
    if [ "$branch_prefix" == "$web" ]; then
        part_name="web"
	elif [ "$branch_prefix" == "$app" ]; then
        part_name='app'
	elif [ "$branch_prefix" == "$server" ]; then
        part_name='server'
	elif [ "$branch_prefix" == "$pkg" ] || [ "$branch_prefix" == "$package" ] || [ "$branch_prefix" == "$packages" ]; then
        part_name='packages'
    elif [ "$branch_prefix" == "$feature" ] || [ "$branch_prefix" == "$common" ]; then
        part_name='common'
    fi

    sed -i.bak "1s/${first_line}/[$part_name] #$issue_number $first_line/" $COMMIT_MSG_FILE
    exit 0
fi
