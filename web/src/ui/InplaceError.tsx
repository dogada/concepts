import Alert from 'react-bootstrap/Alert'

type Props = {
  error: string
}

const InplaceError: React.FC<Props> = ({ error }) => (
  <Alert variant="danger">Error: {`${error}`}</Alert>
)

export default InplaceError
