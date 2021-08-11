import React, { createContext, useContext, useReducer } from "react";
import FilesReducer from "./reducer";
import { ADD_ATTACHMENT, REMOVE_ATTACHMENT, SHOW_MESSAGE } from "./actions";
import { IInitialStateFiles } from "../../interfaces/IAppState";
import { AppFunctions } from "../../App";


const initialState: IInitialStateFiles = {
    files: [],
    responseMessage: "",
    addAttachment: (files: File[]) => { },
    removeAttachment: (file: File) => { },
    createAnnotations: (files: File[]) => { },
    setMessage: (i?: number) => { }
};

const FilesContext = createContext<IInitialStateFiles | undefined>(undefined);

const FilesState = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
    const { webapi, context, ioConnector } = useContext(AppFunctions);
    const [state, dispatch] = useReducer(FilesReducer, initialState);

    const addAttachment = async (files: File[]) => {
        try {
            dispatch({ type: ADD_ATTACHMENT, payload: files });
        } catch (error) {
            console.error(error);
        }
    };

    const removeAttachment = async (file: File) => {
        try {
            dispatch({ type: REMOVE_ATTACHMENT, payload: file });
        } catch (error) {
            console.error(error);
        }
    };

    const createAnnotations = (files: File[]) => {
        const entity: string = context["page"]["entityTypeName"];
        const entityId: string = context["page"]["entityId"];
        const isActivityMimeAttachment: boolean = (entity.toLowerCase() === "email" || entity.toLowerCase() === "appointment");
        const attachmentEntity: string = isActivityMimeAttachment ? "activitymimeattachment" : "annotation";

        const getMeta = (): Promise<string> => context.utils.getEntityMetadata(entity).then((response) => {
            return response.EntitySetName;
        })

        const toBase64 = (file: File) => new Promise<string | ArrayBuffer | null>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onabort = () => reject();
            reader.onerror = error => reject(error);
        });

        const createAnnotationRecord = async (file: File): Promise<ComponentFramework.WebApi.Entity | undefined> => {
            const base64Data: string | ArrayBuffer | null = await toBase64(file);

            if (typeof base64Data === 'string') {
                const base64: string = base64Data.replace(/^data:.+;base64,/, '');
                const entitySetName: string = await getMeta();

                const attachmentRecord: ComponentFramework.WebApi.Entity = {
                    filename: file.name,
                    objecttypecode: entity
                }

                if (isActivityMimeAttachment) {
                    attachmentRecord["objectid_activitypointer@odata.bind"] = `/activitypointers(${entityId})`
                    attachmentRecord["body"] = base64;
                } else {
                    attachmentRecord[`objectid_${entity}@odata.bind`] = `/${entitySetName}(${entityId})`;
                    attachmentRecord["documentbody"] = base64;
                }

                if (file.type && file.type !== "") {
                    attachmentRecord["mimetype"] = file.type;
                }

                return attachmentRecord
            }
        }

        let successfulUploads: number = 0;
        let unsuccessfulUploads: number = 0;
        files.forEach(async (file: File, i: number) => {
            let finished = false;
            const annotation: ComponentFramework.WebApi.Entity | undefined = await createAnnotationRecord(file);

            if (annotation) {
                await webapi.createRecord(attachmentEntity, annotation).then((res) => {
                    if (res.id) {
                        dispatch({ type: REMOVE_ATTACHMENT, payload: file });
                        successfulUploads++;
                    }
                }).catch((err) => {
                    unsuccessfulUploads++;
                    console.error(err);
                }).finally(() => {
                    if (unsuccessfulUploads === 0 && successfulUploads === files.length) {
                        finished = true;
                    }
                    if(unsuccessfulUploads !== 0) {
                        console.error("There were unsuccessful uploads")
                    }
                })
            }

            if (finished) {
                const control = Xrm.Page.getControl(ioConnector.controlToRefresh);
                // @ts-ignore
                control.refresh();
                setMessage(successfulUploads);
            }
        })
    }

    const setMessage = (i?: number) => {
        const payload = i! > 0 ? `You have uploaded ${i} files succesfully` : "";
        dispatch({ type: SHOW_MESSAGE, payload: payload });
    }

    return (
        <FilesContext.Provider value={{
            files: state.files,
            responseMessage: state.responseMessage,
            addAttachment,
            removeAttachment,
            createAnnotations,
            setMessage
        }}>
            {props.children}
        </FilesContext.Provider>

    );
};

const useFilesContext = () => {
    const context = React.useContext(FilesContext)
    if (context === undefined) {
        throw new Error('useAllocationsState must be used within a AllocationsProvider')
    }
    return context
}

export { FilesState, useFilesContext }