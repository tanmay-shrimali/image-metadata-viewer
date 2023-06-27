const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', handleFileSelect, false);

const copyMetadataButton = document.getElementById('copy-metadata-button');
copyMetadataButton.addEventListener('click', copyMetadata, false);

function handleFileSelect(event) {
  const fileList = event.target.files;

  if (fileList.length > 0) {
    const file = fileList[0];
    displayMetadata(file);

    if (file.type.startsWith('image/')) {
      displayImagePreview(file);
    } else {
      clearImagePreview();
    }
  }
}

function displayMetadata(file) {
  EXIF.getData(file, function() {
    const metadataList = document.getElementById('metadata-list');
    metadataList.innerHTML = '';

    const metadata = [
      { label: 'File Name: ', value: file.name },
      { label: 'File Size: ', value: formatBytes(file.size) },
      { label: 'File Type: ', value: file.type },
      { label: 'Dimensions: ', value: this.exifdata.PixelXDimension + 'x' + this.exifdata.PixelYDimension },
      { label: 'Resolution: ', value: this.exifdata.XResolution + 'x' + this.exifdata.YResolution + ' DPI' },
      { label: 'Color Space: ', value: this.exifdata.ColorSpace },
      { label: 'Compression: ', value: this.exifdata.Compression },
      { label: 'Date And Time Created: ', value: this.exifdata.DateTimeOriginal },
      { label: 'Date Re-Modified: ', value: file.lastModifiedDate.toUTCString() },
      { label: 'Camera Makeer: ', value: this.exifdata.Make },
      { label: 'Camera Model: ', value: this.exifdata.Model },
      { label: 'Exposure Time: ', value: this.exifdata.ExposureTime },
      { label: 'Aperture: ', value: this.exifdata.FNumber },
      { label: 'ISO Speed: ', value: this.exifdata.ISOSpeedRatings },
      { label: 'Focal Length: ', value: this.exifdata.FocalLength },
      { label: 'GPS Coordinates Latitude And Longitude: ', value: this.exifdata.GPSLatitude + '"N & ' + this.exifdata.GPSLongitude + '"E '},
      { label: 'Software Used: ', value: this.exifdata && this.exifdata.Software },
      { label: 'Bit Depth: ', value: this.exifdata && this.exifdata.BitsPerSample },
      { label: 'Histogram: ', value: this.exifdata && this.exifdata.Histogram },
      { label: 'Orientation: ', value: this.exifdata && this.exifdata.Orientation },
      { label: 'Digital Signature: ', value: this.exifdata && this.exifdata.DigitalSignature },
      { label: 'Image Description: ', value: this.exifdata && this.exifdata.ImageDescription },
      { label: 'Creator/Author: ', value: this.exifdata && this.exifdata.Artist },
      { label: 'Keywords/Tags: ', value: this.exifdata && this.exifdata.Keywords },
      { label: 'Rating: ', value: this.exifdata && this.exifdata.Rating },
      { label: 'Layers: ', value: this.exifdata && this.exifdata.Layers },
      { label: 'Compression Quality: ', value: this.exifdata && this.exifdata.CompressionQuality },
    ];

    metadata.forEach(data => {
      if (data.value !== undefined && data.value !== null && data.value !== '') {
        const listItem = document.createElement('li');
        listItem.classList.add('metadata-item');

        const label = document.createElement('span');
        label.classList.add('metadata-label');
        label.textContent = data.label;

        const value = document.createElement('span');
        value.classList.add('metadata-value');
        value.textContent = data.value;

        listItem.appendChild(label);
        listItem.appendChild(value);
        metadataList.appendChild(listItem);
      }
    });
  });
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function displayImagePreview(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const previewImage = document.getElementById('preview-image');
    previewImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function clearImagePreview() {
  const previewImage = document.getElementById('preview-image');
  previewImage.src = '';
}

function copyMetadata() {
  const metadataList = document.getElementById('metadata-list');
  const metadataText = metadataList.innerText;

  navigator.clipboard.writeText(metadataText)
    .then(() => {
      alert('Metadata copied to clipboard!');
    })
    .catch(error => {
      console.error('Failed to copy metadata: ', error);
    });
}