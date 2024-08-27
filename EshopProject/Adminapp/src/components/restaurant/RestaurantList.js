import React, { Fragment, useState } from "react";
import { TableCell, Button, Snackbar } from "@material-ui/core";
import axios from "axios";

import ReusableTable from "../layouts/ReusableTable";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Alert } from "@material-ui/lab";
import VisibilityIcon from '@material-ui/icons/Visibility';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CropFreeIcon from '@material-ui/icons/CropFree';
import UpdateIcon from '@material-ui/icons/Update';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const headers = [
  {
    text: "Restaurant ",
    value: "name",
  },
  {
    text: "Logo",
    value: "logo",
  },
  {
    text: "Address",
    value: "tagType",
  },

  {
    text: "Change Status",
    value: "status",
  },
  {
    text: "Update",
    value: "update",
  },
  {
    text: "View",
    value: "view",
  },
  {
    text: "  QR code Generator",
    value: "pdf",
  },
  {
    text: " Get Duplicate ",
    value: "Duplicate",
  },
  {
    text: " QR Count",
    value: "count",
  },
];
export default function TagMasterList(props) {
  const TableB = ({ item, changeStatus, classes, onUpdate, loadData }) => {
    const generatePDf = async (id) => {
      const resData = await axios.get(`restaurant/${id}`);

      const fonts = {
        poppins: {
          normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
          bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
          italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
          bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        },
      };

      // const color = '#000000';
      const colors = [];
      for (let i = 0; i < 3; i++) {
        const color = ["#030403", "#D22323", "#F95919"];
        const r = await axios.post(
          "https://qrcode-monkey.p.rapidapi.com/qr/custom",
          {
            data: `${process.env.REACT_APP_FE_URL}/restaurant/${id}/qr`,
            size: 195,
            download: false,
            file: "png",
            config: {
              body: "mosaic",
              eye: "frame3",
              eyeBall: "ball3",
              eye1Color: `${color[i]}`,
              eye2Color: `${color[i]}`,
              eye3Color: `${color[i]}`,
              eyeBall1Color: `${color[i]}`,
              eyeBall2Color: `${color[i]}`,
              eyeBall3Color: `${color[i]}`,
              bodyColor: `${color[i]}`,
              logo: `${resData.data.qrLogo}`,
              logoMode: "clean",
            },
            //image:"https://firebasestorage.googleapis.com/v0/b/retirement-cal.appspot.com/o/restaurant%2FAsianGardenBostonlogo.png?alt=media&token=3485bd5b-ca60-4264-9eff-e1eaa977a2a4"
          },
          {
            responseType: "blob",
            headers: {
              "content-type": "application/json",
              "x-rapidapi-key":
                "7ce91bfe43msh9dd6398f3319988p1a0265jsn5e2a34a4d02f",
              "x-rapidapi-host": "qrcode-monkey.p.rapidapi.com",
              Accept: "image/png",
            },
          }
        );

        var reader = new FileReader();
        reader.readAsDataURL(r.data);
        // eslint-disable-next-line
        reader.onloadend = function () {
          colors.push(reader.result);
        };
      }

      const content = [];
      // five rows
      setTimeout(() => {
        for (let i = 0; i < 2; i++) {
          const row = { columns: [], justify: "center", alignment: "center" };
          // five columns

          for (let j = 0; j < 2; j++) {
            const design = [
              {
                canvas: [
                  {
                    type: "rect",
                    x: j === 1 ? 5 : -40,
                    y: i === 0 ? -10 : 50,
                    w: 260,
                    h: 355,
                    r: 5,
                    lineColor: "black",
                  },
                ],
              },
              {
                style: "tableExample",
                // margin: [5, 5, 5, 0],
                table: {
                  body: [
                    [
                      {
                        text: "SCAN FOR MENU",
                        alignment: "center",
                        bold: "true",
                        fontSize: 13,
                      },
                    ],
                    [
                      {
                        image:
                          j === 0
                            ? colors[0]
                            : j === 1
                            ? colors[1]
                            : j === 2
                            ? colors[0]
                            : j === 3
                            ? colors[2]
                            : colors[0],
                      },
                    ],
                    [
                      {
                        text: "Powered by",
                        alignment: "center",
                        bold: "true",
                        fontSize: 13,
                      },
                    ],
                    [{ image: "gottamenu", width: 250, height: 55 }],
                    // [{image: '../../assets/login.png'}]
                  ],
                },
                //
                layout: "noBorders",
                absolutePosition:
                  i === 0 && j === 0
                    ? { x: 26, y: 40 }
                    : i === 0 && j === 1
                    ? { x: 315, y: 40 }
                    : i === 1 && j === 0
                    ? { x: 26, y: 440 }
                    : { x: 315, y: 440 },
              },
              
            ];

            row.columns.push(design);
          }
          // push row to content

          content.push(row);
        }
        const dd = {
          content,
          defaultStyle: {
            font: 'poppins'
          },
          images: {
            //code: base64data,
            gottamenu:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoQAAACaCAYAAAAw9FmNAAAACXBIWXMAAA9hAAAPYQGoP6dpAAAIk2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0wNi0wNFQxOTo1MToyOSswNTozMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wNi0wNFQxOTo1MTo0MyswNTozMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMDYtMDRUMTk6NTE6NDMrMDU6MzAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlmZTA2YmFiLWZjNTQtOWE0Yi1hN2Y5LWZmM2EyMTdhMGUxMiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmYxMmMwZTBhLTI1YTktMDA0MC1iNDc3LTUyZTYyOWFhNTRjOCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjI2YTc2NjM4LTBhNGQtYmI0Ni1hZjcxLTA1YzQ2ZjkxOTUxMyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjZhNzY2MzgtMGE0ZC1iYjQ2LWFmNzEtMDVjNDZmOTE5NTEzIiBzdEV2dDp3aGVuPSIyMDIxLTA2LTA0VDE5OjUxOjI5KzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmYxMTY0OTQzLTk2MjAtNTI0Mi05NGZjLWViNjcyYzEyZGIxMyIgc3RFdnQ6d2hlbj0iMjAyMS0wNi0wNFQxOTo1MTo0MyswNTozMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ZmUwNmJh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",
          },
        };

        pdfMake.createPdf(dd,null,fonts).open();
      }, 1000);
    };

    const [alert, setAlert] = useState({
      showAlert: false,
      severity: "success",
      message: "",
    });
    const [open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }

      setOpen(false);
    };

    const copy = async (id) => {
      try {
        await axios.post("/restaurant/copy", { id: id });
        loadData();
        setAlert({
          showAlert: true,
          severity: "success",
          message: "Restaurant Copied!",
        });
        setOpen(true);
      } catch (error) {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Failed!",
        });
        setOpen(true);
      }
    };


    const pdfController =(id)=>{
     
     const r = window.confirm("Are you sure you want to generate a QR code?");
      if (r === true) {
        generatePDf(id)
      } 
     
    }

    const onView = (id) => {
      const newWindow = window.open(
        `${process.env.REACT_APP_FE_URL}/restaurant/${id}/admin`,
        "_blank",
        "noopener,noreferrer"
      );
      if (newWindow) newWindow.opener = null;
    };
    return (
      <Fragment>
        <TableCell key="tagname">{item.name}</TableCell>
        <TableCell key="logo">
          <img src={item.logo} style={{ maxHeight: "100px" }} alt="logo"></img>
        </TableCell>
        <TableCell key="address">{item.address}</TableCell>
        <TableCell key="status">
          {item.status ? (
            <Button
              variant="contained"
              className={classes.red}
              onClick={() => changeStatus(item._id, item.status)}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              variant="contained"
              className={classes.green}
              onClick={() => changeStatus(item._id, item.status)}
            >
              Activate
            </Button>
          )}
        </TableCell>
        <TableCell key="update">
          <Button
            variant="contained"
            className={classes.yellow}
            onClick={() => onUpdate(item._id)}
          >
            <UpdateIcon/>
          </Button>
        </TableCell>
        <TableCell key="update">
          <Button variant="contained" onClick={() => onView(item._id)}>
          <VisibilityIcon/>
          </Button>
        </TableCell>
        <TableCell key="Duplicate">
          <Button
            variant="contained"
            className={classes.yellow}
            onClick={() => pdfController(item._id)}
          >
            <CropFreeIcon/>
          </Button>
        </TableCell>
        <TableCell key="pdf">
          <Button
            variant="contained"
            className={classes.yellow}
            onClick={() => copy(item._id)}
          >
           <FileCopyIcon/>
          </Button>
        </TableCell>
        <TableCell key="address">{item.qrScanCount}</TableCell>
        {open && (
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            {alert.showAlert && (
              <Alert
                severity={alert.severity}
                onClose={() => setAlert({ ...alert, showAlert: false })}
              >
                {alert.message}
              </Alert>
            )}
          </Snackbar>
        )}
      </Fragment>
    );
  };
  return (
    <ReusableTable
      title="View Restaurants"
      headers={headers}
      items={[]}
      TableB={TableB}
      fetchDataUrl="/restaurant"
      statusChangeUrl="/restaurant/status"
      updatePath="/update-restaurant"
      {...props}
    />
  );
}
