

function FileUploader(options){
    var uploadedFiles = []
    function Files() {
        this.fileItems = {}
    }
    FileList.prototype.files = new Files()
    var filesOBJ = new Files()

    function newUid() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    this.filesContainerId = "files_"+newUid()
    this.containerId = "fileUploader_"+newUid()
    this.iconUploadId = "icon-upload_"+newUid()
    this.fileContainerId = "fileContainer_"+newUid()
    this.fileInputId = "fileInput_"+newUid()
    this.addFileSectionId = "addFileSection_"+newUid()
    var self = this
    var appRoot = options.appRoot

    var HTML = '<div id="'+this.containerId+'" class="drag-uploader row fismall">'+
    '<input id="'+this.fileInputId+'" multiple type="file" style="display:none;" />'+
    '<i id="'+this.iconUploadId+'" class="icon-upload upload"><span style="font-size:18px;">Dosya yükle</span></i>'+
    '<div id="'+this.filesContainerId+'" class="d-flex align-items-center">'+

    '</div>'+
    '<div id="'+this.addFileSectionId+'" class="add-file-section d-none">'+
        '<div class="add-file-section-content">'+
            '<i class="icon-plus"></i>'+
            '<span style="font-size:14px;display:block;">Ekle</span>'+
        '</div>'+
    '</div>'+  
    '</div>';
    var temp = document.createElement("div")
    temp.innerHTML = HTML
    var el = document.getElementById(options.el)
    el.appendChild(temp.children[0])

    this._preventDefaults = function (e) {
        e.preventDefault()
        e.stopPropagation()
    }
    var dropContainer = document.getElementById(this.containerId)
    var fileInput = document.getElementById(this.fileInputId)
    var events = ['dragenter', 'dragover', 'dragleave', 'drop']
    for (var v = 0; v < events.length; v++) {
        dropContainer.addEventListener(events[v], this._preventDefaults)
    }
    var dataTransfer = document.createElement("input")
    dataTransfer.setAttribute('type', 'files')

    this.clickFileInput = function(e) {
        var targetText = e.target.className
        if (targetText.indexOf("img") > -1 || targetText.indexOf("delete-icon") > -1) return;
        fileInput.click()
    }
    dropContainer.addEventListener('click',this.clickFileInput)

    this.deleteItem = function (event) {
        var id = event.target.data.id
        var index = event.target.data.index
        delete filesOBJ.fileItems[id]
        uploadedFiles.splice(index, 1)
        document.getElementById(self.fileContainerId).remove()
        if (uploadedFiles.length === 0) {
            document.getElementById(self.iconUploadId).classList.remove('d-none')
            document.getElementById(self.addFileSectionId).classList.add('d-none')
        }
        console.log(id)
    }
    this.fileValidation = function (file) {
        var size = file.size / 1000000;
        var fileName = file.name
        var extension = fileName.split('.')[1]
        if (size <= 1024) {
            if (extension === "png" || extension === "jpg" || extension === "jpeg" || extension === "gif" || extension === "bmp") {
                return "image";
            } else {
                return "file";
            }
        }
        else {
            alert("", "Dosya boyutu en fazla 5 Megabyte olabilir!")
            return null
        }

    }
    dropContainer.ondrop = function (e) {
        let dt = e.dataTransfer
        let files = dt.files
        for (var i = 0; i < files.length; i++) {
            var file = files[i]
            var newID = newUid()
            var fileType = self.fileValidation(file)
            if (fileType) {
                self.readFile(file, fileType, newID, self.loadFile)
                filesOBJ.fileItems[newID] = file
                filesOBJ.fileItems[newID]["id"] = newID
            }
        }
    } 
    fileInput.onchange = function (event) {
        var files = fileInput.files
        for (var i = 0; i < files.length; i++) {
            var file = files[i]
            var newID = newUid()
            var fileType = self.fileValidation(file)
            if (fileType) {
                self.readFile(file, fileType, newID, self.loadFile)
                filesOBJ.fileItems[newID] = file
                filesOBJ.fileItems[newID]["id"] = newID
            }
        }
    }

    this.handleClickItem = function (event) {
        var id = event.target.data.id
    }
    this.getFileIcon = function (file, id) {
        var fileExtension = file.extension
        var fileType = file.fileType
        if (fileType === "image") {
            return '<img class="img" src="' + file.src + '" alt="' + file.name + '" id="' + id + '" title="' + file.name + '" />'
        } else {
            if (fileExtension === "doc" || fileExtension === "docx") return '<i class="img icon icon-file-word" title="' + file.name + '"></i>';
            else if (fileExtension === "xls" || fileExtension === "xlsx") return '<i class="img icon icon-file-excel" title="' + file.name + '"></i>';
            else if (fileExtension === "ppsx" || fileExtension === "pptx") return '<i class="img icon icon-file-powerpoint" title="' + file.name + '"></i>';
            else if (fileExtension === "pdf") return '<i class="img icon icon-file-pdf" title="' + file.name + '"></i>';
            else if (fileExtension === "mp4" || fileExtension === "mov") return '<i class="img icon icon-file-video" title="' + file.name + '"></i>';
            else if (fileExtension === "txt") return '<i class="img icon icon-file-document" title="' + file.name + '"></i>';
            else if (fileExtension === "xml") return '<i class="img icon icon-file-xml" title="' + file.name + '"></i>';
            else return '<i class="img icon icon-file" title="' + file.name + '"></i>';
        }

    }
    this.loadFile = function(e, file, fileType, id) {
        var extension = file.name.split('.')[1]
        var srcImg = ""
        var loadedFile = null
        var filesContainer = document.getElementById(self.filesContainerId)
        var temp = document.createElement("div")
        var _HTML = ""
        if (document.getElementById(self.iconUploadId).className.indexOf('d-none') === -1) {
            document.getElementById(self.iconUploadId).classList.add('d-none')
            document.getElementById(self.addFileSectionId).classList.remove('d-none')
        }
        if (fileType === "image") {
            loadedFile = { id: id, src: e.target.result, name: file.name, extension: extension, fileType: fileType }
            uploadedFiles.push(loadedFile)
            _HTML = ('<div id="'+self.fileContainerId+'" class="file-container" style="position:relative;float:left;">' +
                '<div class="file-input-img-container" id="imgIconContainer_'+id+'" data-id="' + id + '">' +
                self.getFileIcon(loadedFile , id )+
                '</div>' +
                '<i id="icon_'+id+'" data-index="' + (uploadedFiles.length - 1) + '" data-id="' + id + '" class="icon-close delete-icon"></i></div>')
                temp.innerHTML = _HTML
                filesContainer.appendChild(temp.children[0])

               
        } else if (fileType === "file") {
            if (!extension || extension.length === 0) {
                srcImg = "file"
            }
            loadedFile = { id: id, src: "", name: file.name, extension: extension, fileType: fileType }
            uploadedFiles.push(loadedFile);
            _HTML =('<div id="'+self.fileContainerId+'" class="file-container" style="position:relative;float:left;">' +
                '<div class="file-input-icon-container" id="imgIconContainer_'+id+'" data-id="' + id + '">' +
                self.getFileIcon(loadedFile, id) +
                '</div>' +
                '<i id="icon_'+id+'" data-index="' + (uploadedFiles.length - 1) + '" data-id="' + id + '" class="icon-close delete-icon"></i></div>')
                temp.innerHTML = _HTML
                filesContainer.appendChild(temp.children[0])
        }
        var deleteBtn = document.getElementById('icon_'+id)
        deleteBtn.addEventListener('click',self.deleteItem)

        var imgContainer = document.getElementById('imgIconContainer_'+id)
        imgContainer.addEventListener('click',self.handleClickItem)
    }
    this.readFile = function (file, fileType, id, callBack) {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function (e) {
            callBack(e, file, fileType, id)
        }

    }
    this.getFiles = function(){
        return filesOBJ.fileItems
    }

    return self
}