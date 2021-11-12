import {connect} from 'react-redux'
import { logoutUser } from '../../actions/session/session_actions'
import Home from './home'

const mapStateToProps = ({session, currentView, entities: {users}}) => ({
    currentUserId: session.id,
    channelId: currentView.channelId,
    users: users
})

const mapDispatchToProps = dispatch => ({
    logoutUser: () => dispatch(logoutUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)