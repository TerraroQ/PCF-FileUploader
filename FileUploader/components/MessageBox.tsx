import React, { useEffect } from "react";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useFilesContext } from "../context/Files/state";

const MessageBox = () => {
    const { responseMessage, setMessage } = useFilesContext();

    useEffect(() => {
        setTimeout(() => {
            setMessage(0);
        }, 5000)
    }, [responseMessage])

    return (
        <>
            {responseMessage &&
                <MessageBar
                    messageBarType={MessageBarType.success}
                    isMultiline={false}
                    dismissButtonAriaLabel="Close"
                >
                    {responseMessage}
                </MessageBar>
            }
        </>
    );
};

export default MessageBox;