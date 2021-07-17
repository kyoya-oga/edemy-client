import { Modal } from 'antd'
import ReactPlayer from 'react-player'

const PreviewModal = ({ preview, showModal, setShowModal }) => {
  return (
    <>
      <Modal
        title="コースプレビュー"
        visible={showModal}
        onCancel={() => setShowModal(!showModal)}
        width={720}
        footer={null}
      >
        <div className="wrapper">
          <ReactPlayer
            url={preview}
            playing={showModal}
            controls={true}
            width="100%"
            height="100%"
          />
        </div>
      </Modal>
    </>
  )
}

export default PreviewModal
