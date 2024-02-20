import React from 'react';
import { Nav, Navbar, Offcanvas, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavbarComponent = () => {
  const [showOffcanvas, setShowOffcanvas] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const handleNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === 'granted') {
            // ユーザーが通知を許可した場合の処理
            console.log('Notification permission granted!');
          }
        })
        .catch((error) => {
          console.error('Error requesting notification permission:', error);
        });
    }
  };

  return (
    <>
      <Navbar expand="lg">
        <Navbar.Brand href="#home"></Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasRight" onClick={() => setShowOffcanvas(true)} />
      </Navbar>

      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>メニュー</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-grid gap-2">
            <Button variant="primary" onClick={() => setShowModal(true)}>通知送信</Button>
            {/* メニューの内容 */}
            <Nav className="mr-auto">
              <Nav.Link href="/Logout">ログアウト</Nav.Link>
            </Nav>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>通知について</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          タスクを追加したときに通知を送信します。
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>いいえ</Button>
          <Button variant="primary" onClick={handleNotificationPermission}>はい</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavbarComponent;
