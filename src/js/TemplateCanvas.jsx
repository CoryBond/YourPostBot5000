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

  render() {
    let baseImage = this.state.baseImage;
    if (baseImage) {
      var baseImage2 = new Image();
      var that = this;
      baseImage2.onload = function(){
        if (!that.canvas.getContext) {
          alert('Error: Canvas context does not exist!');
          return;
        } else{
          var tccontext = that.canvas.getContext('webgl');
          tcccontext.drawImage(baseImage2, 20, 20, 100, 100);
        }
      }

      baseImage2.src = 'http://www.myhappybirthdaywishes.com/wp-content/uploads/2016/03/happy-birthday-dog-funny-memes.jpg';
    }

    return (
      <div>
        <div className="ImageUpload">
          <ImageUpload setImage={this.setBaseImage}/>
        </div>
        <p>Canvas:</p>
        <canvas width="500" height="500" ref={canvasRef => this.canvas = canvasRef}>
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