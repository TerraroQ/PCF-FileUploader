import React from 'react'
import { DetailsList, DetailsListLayoutMode, Selection } from "@fluentui/react/lib/DetailsList";
import { Link } from '@fluentui/react/lib/Link';

interface ILinesProps {
  attachments: any;
  DSPMessage: any;
  appFunctions: any;
}

class AttachmentsList extends React.Component<ILinesProps> {
  private _selection: Selection;
  private columns = [
    {
      key: 'column1',
      name: 'File Type',
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      iconName: 'Page',
      isIconOnly: true,
      fieldName: 'name',
      minWidth: 16,
      maxWidth: 16,
      onRender: (item: any) => {
        if (item.Name) {
          let fileType = item.Name.match(/[^.]+$/)[0];
          if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'gif' || fileType === 'bmp' || fileType === 'svg') {
            fileType = 'photo';
          }
          return <img src={'https://static2.sharepointonline.com/files/fabric/assets/item-types/16/' + fileType + '.svg'} alt={item.fileType + ' file icon'} />;
        } else {
          return;
        }
      },
    },
    {
      key: 'Name', name: 'Name', fieldName: 'Name', minWidth: 200, maxWidth: 200, isResizable: true, onRender: (item: any) => {
        if(item.ServerRelativeURL) {
          return <Link href={item.ServerRelativeURL} target="_blank">{item.Name}</Link>
        } else {
          return <Link href={`${this.props.DSPMessage['spsiteoas.absoluteurl']}/${this.props.DSPMessage['spsiteal.relativeurl']}/${this.props.DSPMessage['doclocaldos.relativeurl']}/${this.props.DSPMessage['doclocopp.relativeurl']}/${item.Name}`} target="_blank">{item.Name}</Link>
        }
      }
    },
    { key: 'UIVersionLabel', name: 'Version', fieldName: 'UIVersionLabel', minWidth: 200, maxWidth: 200, isResizable: true },
    { key: 'DocType', name: 'Document Type', fieldName: 'DocType', minWidth: 200, maxWidth: 200, isResizable: true }
  ]

  constructor(props: any) {
    super(props);

    console.log(this.props.attachments);
    

    this._selection = new Selection({
      onSelectionChanged: () => {
        this.buildAttachmentsJSON(this._selection.getSelection())
      }
    });

    const selectItems = (i: number) => {
      setTimeout(() => {
        this._selection.setIndexSelected(i, true, false);
      }, 500)
    }

    if (this.props.appFunctions.outputJSON !== null && this.props.appFunctions.outputJSON.length > 3) {
      this._selection.setItems(JSON.parse(this.props.appFunctions.outputJSON), true);

      const spList = this.props.attachments;
      const outputList = JSON.parse(this.props.appFunctions.outputJSON);

      if (outputList && outputList.length > 0) {
        outputList.forEach(function (outputItem) {
          var index = spList.findIndex(x => x.UniqueId === outputItem.UniqueId);
          selectItems(index);
        })
      }

    }

  }

  render() {
    return (<>{this.props.DSPMessage && this.props.DSPMessage.statuscode === 1 && this.props.DSPMessage.dp_direction === true ?
      <DetailsList
        items={this.props.attachments}
        setKey="set"
        checkboxVisibility={1}
        compact={true}
        layoutMode={DetailsListLayoutMode.fixedColumns}
        selectionPreservedOnEmptyClick={true}
        selection={this._selection}
        enableUpdateAnimations={true}
        columns={this.columns}
        selectionMode={2}
      />
      :
      <DetailsList
        items={this.props.DSPMessage.dp_attachments && this.props.DSPMessage.dp_attachments.length > 0 ? JSON.parse(this.props.DSPMessage.dp_attachments) : []}
        setKey="set"
        checkboxVisibility={2}
        compact={true}
        layoutMode={DetailsListLayoutMode.fixedColumns}
        columns={this.columns}
      />
    }
    </>
    )
  }

  buildAttachmentsJSON(selection) {
    let attachmentList: { UniqueId: string, ServerRelativeURL: string, Name: string, UIVersionLabel: string, UIVersion: string, DocType: string }[] = [];
    for (const item of selection) {
      const attachment = {
        "UniqueId": item.UniqueId,
        "Name": item.Name,
        "ServerRelativeURL": "",
        "UIVersionLabel": item.UIVersionLabel,
        "UIVersion": item.UIVersion,
        "DocType": ''
      }
      if (item.ServerRelativeURL) {
        attachment.ServerRelativeURL = item.ServerRelativeURL;
      } else {
        attachment.ServerRelativeURL = `${this.props.DSPMessage['spsiteoas.absoluteurl']}/${this.props.DSPMessage['spsiteal.relativeurl']}/${this.props.DSPMessage['doclocaldos.relativeurl']}/${this.props.DSPMessage['doclocopp.relativeurl']}/${item.Name}`
      }

      attachmentList.push(attachment);
    }
    console.log(attachmentList)
    this.props.appFunctions.onInputChange(attachmentList);
  }
}

export default AttachmentsList
