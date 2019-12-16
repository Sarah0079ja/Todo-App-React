import React, { Component } from 'react';
import axios from 'axios';
import Home from '../components/Home'
// import $ from 'jquery';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFiles: null
    }
  }



  multipleFileChangedHandler = (event) => {
    this.setState({
      selectedFiles: event.target.files
    });
    console.log(event.target.files);
  };

  multipleFileUploadHandler = () => {
    const data = new FormData();
    let selectedFiles = this.state.selectedFiles;
    // If file selected
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append('galleryImage', selectedFiles[i], selectedFiles[i].name);
      }
      axios.post('/api/quizzApp/multiple-file-upload', data, {
        headers: {
          'accept': 'application/json',
   
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        }
      })
        .then((response) => {
          console.log('res', response);
          if (200 === response.status) {
            // If file size is larger than expected.
            if (response.data.error) {
              if ('LIMIT_FILE_SIZE' === response.data.error.code) {
                this.ocShowAlert('Max size: 2MB', 'red');
              } else if ('LIMIT_UNEXPECTED_FILE' === response.data.error.code) {
                this.ocShowAlert('Max 5 images allowed', 'red');
              } else {
                // If not the given file type
                this.ocShowAlert(response.data.error, 'red');
              }
            } else {
              // Success
              let fileName = response.data;
              console.log('fileName', fileName);
              this.ocShowAlert('File Uploaded', '#3089cf');
            }
          }
        }).catch((error) => {
          // If another error
          this.ocShowAlert(error, 'red');
        });
    } else {
      // if file not selected throw error
      this.ocShowAlert('Please upload file', 'red');
    }
  };

  render() {
    return (
      <div>
        <div className="card border-light mb-3" style={{ boxShadow: '0 5px 10px 2px rgba(195,192,192,.5)' }}>
          <div className="card-header">
            <h3 style={{ color: '#555', marginLeft: '12px' }}>Upload Muliple Images</h3>
            <p className="text-muted" style={{ marginLeft: '12px' }}>Upload Size: 400px x 400px ( Max 2MB )</p>
          </div>
          <div className="card-body">
            <p className="card-text">Images from Farmhub</p>
            <input type="file" multiple onChange={this.multipleFileChangedHandler} />
            <div className="mt-5">
              <button className="btn btn-info" onClick={this.multipleFileUploadHandler}>Upload!</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;
