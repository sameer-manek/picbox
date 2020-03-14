import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './dropzone.css'

function Dropzone(props)
{
    var [error, setError] = useState("")
    var [message, setMessage] = useState("Drag 'n' drop some files here, or click to select files")

    const printError = () => {
            return <i style={{color: "red", marginBottom: "10px", fontWeight: "bold", fontSize: "22px"}}>{error}</i>
    }

    const onDrop = useCallback(async acceptedFiles => {
        // upload the files
        var flag = true
        var procesed = 0
        await acceptedFiles.forEach(file => {
            let filename = file.name
            let file_ext = filename.split('.').pop()
            let height, width

            var img = document.createElement("img");

            var reader = new FileReader();
            reader.onloadend = function (ended) {
                img.src = ended.target.result;
            }
            reader.readAsDataURL(file);

            img.onload = function () {
                width = img.width
                height = img.height

                if (file_ext !== "png" && file_ext !== "jpg" && file_ext !== "jpeg" && flag) {
                    setError("File must be a JPG or PNG..")
                    setMessage("There was an error while uploading " + filename)
                    flag = false
                }

                if (width < 12 && height < 12 && flag) {
                    setError(filename + " too small (smallest edge >= 1200px)")
                    setMessage("There was an error while uploading images")
                    flag = false
                }

                if (flag)
                    ++procesed

                while(procesed >= acceptedFiles.length) {
                    props.handleFiles(acceptedFiles);
                    break
                }
            }
        });
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop
    })

    return(
        <div className="dropzone" style={{display: props.display}}>
            <button className="closeBtn" onClick={ () => { props.toggle() }}>
                <span className="fa fa-close"></span>
            </button>
            <div className="dropbox" {...getRootProps()}>
                <input {...getInputProps()} multiple />
                <p>{message}</p>
            </div>
            {printError()}
        </div>
    )
}

export default Dropzone