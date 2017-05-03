class ImageUpload extends React.Component
{
  constructor(props) {
    super(props);
  }

  _handleImageChange(e) {
    e.preventDefault();

    //lock image
    this.fileUpload.disabled=true;

    //upload file
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
        this.props.setImage(reader.result);
    }

    reader.readAsDataURL(file)
  }

  _handleLock(e) {
    e.preventDefault();

    //lock image
    this.fileUpload.disabled=false;
  }

  render() {
    return (
      <nav className="ImageUpload">
        <div>
          <div>
            <a className="navbar-brand" href="#">YourPostBot5000</a>
          </div>
        <form>
          <input id="fileUpload" ref={(input) => {this.fileUpload = input }}
            type="file" 
            onChange={(e)=>this._handleImageChange(e)} />
          <button id="lockUpload"
            type="submit" 
            onClick={(e)=>this._handleLock(e)}>Unlock Upload</button>
        </form>
        </div>
      </nav>
    )
  }
};

class TemplateCanvas extends React.Component
{
  constructor(props) {
    super(props);
    this.setBaseImage = this.setBaseImage.bind(this);
    this.state = {baseImage: '',canvasImage: ''};
  }

  setBaseImage(image){
    this.setState({
      baseImage: image
    });
  }

  componentDidUpdate(){
    const tccontext = this.refs.canvas.getContext('2d');
    let baseImage = this.state.baseImage;
    if (baseImage) {
      var contextImage = new Image();
      contextImage.onload = function(){
        tccontext.drawImage(contextImage, 0, 0, 1000, 1000);
      }

      contextImage.src = baseImage;
    }
  }

  render() {
    return (
      <div>
        <div className="ImageUpload">
          <ImageUpload setImage={this.setBaseImage}/>
        </div>
        <p>Canvas:</p>
        <canvas ref="canvas" width="500" height="500">
          Your browser does not support the HTML5 canvas tag.
        </canvas>
      </div>
    )
  }
};


////TemplateCanvas/>
//  <ImageUpload baseImage={TemplateCanvas.state.baseImage}/>
//</TemplateCanvas>
ReactDOM.render(
   <TemplateCanvas/>, 
  document.getElementById("templateCanvas"));