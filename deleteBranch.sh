#!/bin/bash

# Function to check if the branch is the main branch
is_main_branch() {
    local branch_name="$1"
    if [ "$branch_name" == "main" ] || [ "$branch_name" == "master" ]; then
        return 0 # true
    else
        return 1 # false
    fi
}

# Function to delete a branch
delete_branch() {
    local branch_name="$1"

    # Check if the branch is the main branch
    if is_main_branch "$branch_name"; then
        echo "Error: Cannot delete the main branch '$branch_name'."
        exit 1
    fi

    # Delete the local branch
    git branch -d "$branch_name"
    if [ $? -ne 0 ]; then
        echo "Error: Failed to delete local branch '$branch_name'. It may not exist."
        exit 1
    fi

    # Delete the remote branch
    git push origin --delete "$branch_name"
    if [ $? -ne 0 ]; then
        echo "Error: Failed to delete remote branch '$branch_name'. It may not exist."
        exit 1
    fi

    echo "Branch '$branch_name' deleted successfully."
}

# Ask for branch name to delete
echo "Enter the branch name to delete: "
read branch_name
delete_branch "$branch_name"
