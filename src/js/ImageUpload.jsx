class ImageUpload extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {file: '',imagePreviewUrl: ''};
  }

  _handleLock(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', this.state.file);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  render() {
    return (
      <nav className="ImageUpload">
        <div>
          <div>
            <a className="navbar-brand" href="#">YourPostBot5000</a>
          </div>
        <form onSubmit={(e)=>this._handleSubmit(e)}>
          <input className="fileUpload" 
            type="file" 
            onChange={(e)=>this._handleImageChange(e)} />
          <button className="Unlock Upload" 
            type="submit" 
            onClick={(e)=>this._handleLock(e)}>Upload Image</button>
        </form>
        </div>
      </nav>
    )
  }
};