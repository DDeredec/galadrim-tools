import { hasRights, IdeaState, IIdea, IUserData } from '@galadrim-tools/shared'
import { Delete, Done, Comment } from '@mui/icons-material'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import {
    Box,
    BoxProps,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { observer } from 'mobx-react-lite'
import moment from 'moment'
import 'moment/dist/locale/fr'
import { useMemo } from 'react'

import { AppStore } from '../../globalStores/AppStore'
import { SimpleModal } from '../../reusableComponents/modal/SimpleModal'
import { SimpleModalStore } from '../../reusableComponents/modal/SimpleModalStore'
import { getNameOfUsers } from '../saveur/restaurants/ratingsFunctions'
import CommentIdeaModal from './CommentIdeaModal'
import { getUsersIdWithSpecificReaction } from './helper'
import { findUserReaction } from './IdeasStore'
import { getHumanFormattedDate, getHumanFormattedTimeDifference } from './ideasUtils'

const getReactions = (idea: IIdea, userId: IUserData['id']) => {
    const numberOfReaction = idea.reactions.length

    const numberOfUpvote = idea.reactions.filter((r) => r.isUpvote).length
    const numberOfDownvote = numberOfReaction - numberOfUpvote

    const currentUserReaction = findUserReaction(idea, userId)?.isUpvote ?? null

    const result = {
        numberOfUpvote,
        numberOfDownvote,
        currentUserReaction,
    }

    return result
}

const IconReactionWrapper = styled(Box)<BoxProps>(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const getBgColor = (state: IdeaState, isBad: boolean) => {
    if (state === 'DONE') {
        return 'rgba(76, 175, 80, 0.1)'
    }
    if (isBad) {
        return 'rgba(120, 120, 120, 0.5)'
    }
    return undefined
}

const Idea = observer<{ idea: IIdea; user: IUserData; isBad?: boolean }>(
    ({ idea, user, isBad = false }) => {
        const modalStore = useMemo(() => new SimpleModalStore(), [])
        const { ideaStore, users, authStore } = AppStore
        const { numberOfUpvote, numberOfDownvote, currentUserReaction } = getReactions(
            idea,
            user.id
        )

        const author_username = idea.createdBy ? users.get(idea.createdBy)?.username : ''

        return (
            <>
                <Card
                    style={{
                        cursor: 'pointer',
                        maxWidth: 345,
                        backgroundColor: getBgColor(idea.state, isBad),
                        opacity: isBad && idea.state !== 'DONE' ? 0.8 : undefined,
                    }}
                >
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            {idea.text}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ display: 'flex', overflowX: 'auto', paddingY: 0 }}>
                        <Tooltip title={'Commentaires'}>
                            <Box
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Typography>{idea.comments.length}</Typography>
                                <IconButton onClick={() => modalStore.setModalOpen(true)}>
                                    <Comment />
                                </IconButton>
                            </Box>
                        </Tooltip>
                        <Tooltip
                            title={getNameOfUsers(
                                getUsersIdWithSpecificReaction(idea, true),
                                users
                            )}
                        >
                            <IconReactionWrapper>
                                <IconButton
                                    onClick={() => ideaStore.setReaction(idea.id, user.id, true)}
                                >
                                    <ThumbUpIcon
                                        sx={{
                                            color:
                                                currentUserReaction === true
                                                    ? '#5bb65f'
                                                    : undefined,
                                        }}
                                    />
                                </IconButton>
                                {numberOfUpvote}
                            </IconReactionWrapper>
                        </Tooltip>
                        <Tooltip
                            title={getNameOfUsers(
                                getUsersIdWithSpecificReaction(idea, false),
                                users
                            )}
                        >
                            <IconReactionWrapper sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton
                                    onClick={() => ideaStore.setReaction(idea.id, user.id, false)}
                                >
                                    <ThumbDownIcon
                                        sx={{
                                            color:
                                                currentUserReaction === false
                                                    ? '#f0625f'
                                                    : undefined,
                                        }}
                                    />
                                </IconButton>
                                {numberOfDownvote}
                            </IconReactionWrapper>
                        </Tooltip>
                    </CardActions>
                    {(hasRights(authStore.user.rights, ['IDEAS_ADMIN']) || idea.isOwner) && (
                        <CardActions
                            sx={{
                                display: 'flex',
                                overflowX: 'auto',
                                justifyContent: 'flex-end',
                                paddingY: 0,
                            }}
                        >
                            <Tooltip title={'Supprimer'}>
                                <IconReactionWrapper>
                                    <IconButton onClick={() => ideaStore.deleteIdea(idea.id)}>
                                        <Delete />
                                    </IconButton>
                                </IconReactionWrapper>
                            </Tooltip>
                            <Tooltip
                                title={`Marquer comme ${ideaStore.getUiNextIdeaStateString(
                                    idea.state
                                )}`}
                            >
                                <IconReactionWrapper>
                                    <IconButton onClick={() => ideaStore.update(idea.id)}>
                                        <Done />
                                    </IconButton>
                                </IconReactionWrapper>
                            </Tooltip>
                        </CardActions>
                    )}
                    <CardActions
                        sx={{ paddingTop: 0, display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Typography
                            sx={{
                                fontSize: 11,
                                color: 'gray',
                            }}
                        >
                            {isBad ? '' : author_username}
                        </Typography>
                        <Tooltip title={getHumanFormattedDate(idea.createdAt)}>
                            <Typography sx={{ fontSize: 11, color: 'gray' }}>
                                {getHumanFormattedTimeDifference(idea.createdAt)}
                            </Typography>
                        </Tooltip>
                    </CardActions>
                </Card>
                <SimpleModal
                    open={modalStore.modalOpen}
                    width={800}
                    onClose={() => modalStore.setModalOpen(false)}
                >
                    <CommentIdeaModal idea={idea} userId={user.id} />
                </SimpleModal>
            </>
        )
    }
)

export default Idea
