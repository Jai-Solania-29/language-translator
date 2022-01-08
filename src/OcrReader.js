import { useState } from "react"
import { createWorker } from "tesseract.js"
import './OcrReader.css';
import { FaLanguage } from "react-icons/fa";

// OCR Statuses
const STATUSES = {
  IDLE: "",
  FAILED: "Failed to perform OCR",
  PENDING: "Processing...",
  SUCCEEDED: "OCR processing complete",
}

function OcrReader({onReadOcrData, onRemoveClicked}) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [ocrState, setOcrState] = useState(STATUSES.IDLE)
  const worker = createWorker()
  
  // Process image with OCR
  const readImageText = async() => {
    setOcrState(STATUSES.PENDING)
    try {
      await worker.load()
      // Set the language to recognize

      await worker.loadLanguage('eng + spa + chi_sim + jpn + kor + por + fra + ita + rus + ara + fin + fra + deu + hin + hun + ind + gle + pol + swe + tur + ukr + vie');
      await worker.initialize('eng + spa + chi_sim + jpn + kor + por  + fra + ita + rus + ara + fin + fra + deu + hin + hun + ind + gle + pol + swe + tur + ukr + vie');
      

      const { data: { text } } = await worker.recognize(selectedImage) 
      await worker.terminate()

      onReadOcrData(text)
      setOcrState(STATUSES.SUCCEEDED)
    } catch (err) {
      setOcrState(STATUSES.FAILED)
    }
  }

  // Executed when "Use another image" is selected
  const handleRemoveClicked = () => {
    setSelectedImage(null)
    onRemoveClicked()
    setOcrState(STATUSES.IDLE)
  }

  return (
    <div>
      {selectedImage && (
        <div>
          <img src={URL.createObjectURL(selectedImage)} alt="scanned file"  />
        </div>
      )}
      <div>
        {selectedImage?
          <div className="button-container">
            <button onClick={readImageText}>Process the image with OCR</button>
            <button
              className="remove-button"
              disabled={ocrState === STATUSES.PENDING}
              onClick={handleRemoveClicked}
            >
                Use another image
            </button>
          </div>
          :
          <>
            <h3 className="upload">Upload an Image to Convert</h3>
            <input className="choose-file"
              type="file"
              name="ocr-image"
              onChange={(event) => {
                setSelectedImage(event.target.files[0])
              }}
            />
            {/* <p className="para-1"><span className="head-1">Supported Formats: </span>bmp, jpg, png, pbm</p>
            <p className="para-2"><span className="head-2">Supported Languages: </span>English, Hindi, Chinese, French, Tamil, Telugu, Marathi, Spanish, Turkish, Greek, Urdu, Gujrati, Nepali.</p> */}
          </>
        }
      </div>
      <div className="status">
        {ocrState}
      </div>
      <br />
      <div className="footer">
        <h2 className="footer-head">ACROSS THE WORLD</h2>
        <hr className="line"></hr>
        <h1 className="title">LANGUAGE TRANSLATOR</h1>
        <div className="icons">
        <FaLanguage/>
        </div>
      <div className="main-content">
        <div className="container-1">
        <h2 className="f-format">File Format Supported</h2>
        <p>
          JPG <br></br>
          PNG <br></br>
          PBM <br></br>
          JPEG <br></br>
          WAV
        </p>
        </div>

        <div className="container-2">
          <h2 className="l-format">Languages Supported</h2>
          <div className="languages">
          <div className="language-1">
            <p>
          HINDI <br></br>
          ENGLISH <br></br>
          FRENCH <br></br>
          CHINESE <br></br>
          TAMIL <br></br>
          TELUGU <br></br>
          MARATHI <br></br>
          </p>
          </div>
        <div className="language-2">
          <p>
          SPANISH <br></br>
          TURKISH <br></br>
          GREEK <br></br>
          URDU <br></br>
          GUJRATI <br></br>
          NEPALI <br></br>
          AND MANY MORE 
        </p>
        </div>
        </div>
        </div>
      </div>

    </div>
    </div>
  )  
}

export default OcrReader