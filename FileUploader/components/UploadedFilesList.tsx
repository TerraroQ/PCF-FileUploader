import React from "react";
import { useFilesContext } from "../context/Files/state";
import { Icon } from "@fluentui/react/lib/Icon";
import { Text } from "@fluentui/react/lib/Text";
import { DetailsList, IColumn } from "@fluentui/react/lib/DetailsList";

const UploadedFilesList = () => {
    const { files, removeAttachment } = useFilesContext();
    const DeleteIcon = () => <Icon iconName="Delete" className="ms-IconExample" />;
    const columns: IColumn[] = [
        { key: 'name', name: 'File name', fieldName: 'name', minWidth: 100, maxWidth: 100, isResizable: true },
        {
            key: 'remove',
            name: '',
            minWidth: 20,
            maxWidth: 20,
            isCollapsable: false,
            onRender: (file: File, i: number | undefined) => (
                <a onClick={() => { removeAttachment(file!) }}><DeleteIcon /></a>
            )
        }
    ];

    return (
        <>
            {files?.length > 0 &&
                <>
                    <Text variant={"xLarge"} block={true}>Files ready to upload</Text>
                    <DetailsList
                        items={files}
                        columns={columns}
                        compact={true}
                        constrainMode={0}
                        selectionMode={2}
                        checkboxVisibility={2}

                    />
                </>
            }
        </>
    );
};

export default UploadedFilesList;