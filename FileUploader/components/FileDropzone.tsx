import React from "react";
import Dropzone from 'react-dropzone';
import { useFilesContext } from "../context/Files/state";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import styled from 'styled-components';

const getColor = (props:any) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#eeeeee';
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
  margin-bottom: 10px;
`;

const FileDropzone = () => {
    const { files, addAttachment, createAnnotations } = useFilesContext();

    const handleDrop = (acceptedFiles:File[]): void => {
        addAttachment(acceptedFiles);
    }

    const handleUpload = (files: File[]) => {
        createAnnotations(files);
    }

    const StyledDropzone = () => {    
        return (
            <Dropzone onDropAccepted={(acceptedFiles:File[]) => handleDrop(acceptedFiles)}>
                {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => (
                    <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
                        <input {...getInputProps()} />
                        <p>Select files...</p>
                    </Container>
                )}
            </Dropzone>
        );
    }

    return (
        <>
            <StyledDropzone  />
            <PrimaryButton onClick={() => handleUpload(files)} disabled={files.length === 0}>Upload</PrimaryButton>
        </>
    );
};

export default FileDropzone;