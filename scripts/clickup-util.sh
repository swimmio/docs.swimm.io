#!/bin/bash
source .buildrc 

function get() {
    local url=$1
    curl -sS --dump-header /dev/null --header "Authorization: "${TOKEN}"" $url
}

function get_teams() {
    local url="https://api.clickup.com/api/v2/team"
    get "$url"
}

function get_spaces() {
    local team_id=$1
    local url="https://api.clickup.com/api/v2/team/${team_id}/space?archived=true"
    get "$url"
}

function get_folders() {
    local space_id=$1
    local url="https://api.clickup.com/api/v2/space/${space_id}/folder?archived=true"
    get "$url"
}

get_folders "$SPACE"