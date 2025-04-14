import useStateWithCallback from "./useStateWithCallback.js";
import {useCallback, useEffect, useRef} from "react";
import socket from "../utils/socket/socket.js";
import {ACTIONS} from "../utils/socket/actions.js";
import freeice from 'freeice';

const useWebRTC = () => {
    const [clients, updateClients] = useStateWithCallback([]);
    const LOCAL_AUDIO = 'LOCAL_AUDIO';

    const addNewClient = useCallback((newClient, cb) => {
        updateClients(list => {
            if (!list.includes(newClient)) {
                return [...list, newClient]
            }

            return list;
        }, cb);
    }, [clients, updateClients]);

    const peerConnections = useRef({});
    const localMediaStream = useRef(null);
    const peerMediaElements = useRef({
        [LOCAL_AUDIO]: null,
    });

    useEffect(() => {
        const startCapture = async() => {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });

            addNewClient(LOCAL_AUDIO, () => {
                const localAudioElement = peerMediaElements.current[LOCAL_AUDIO];

                if (localAudioElement) {
                    localAudioElement.volume = 0;
                    localAudioElement.srcObject = localMediaStream.current;
                }
            });
        }

        socket.on(ACTIONS.START_JOIN_INTO_VOICE, () => {
            startCapture()
                .then(() => socket.emit(ACTIONS.JOIN_INTO_VOICE))
                .catch(e => console.error('Error getting userMedia:', e));
        })

        return () => {
            localMediaStream.current?.getTracks().forEach(track => track.stop());
            socket.emit(ACTIONS.LEAVE);

            socket.off(ACTIONS.START_JOIN_INTO_VOICE);
        };
    }, []);

    useEffect(() => {
        const setRemoteMedia = async({peerID, sessionDescription: remoteDescription}) => {
            await peerConnections.current[peerID]?.setRemoteDescription(
                new RTCSessionDescription(remoteDescription)
            );

            if (remoteDescription.type === 'offer') {
                const answer = await peerConnections.current[peerID].createAnswer();

                await peerConnections.current[peerID].setLocalDescription(answer);

                socket.emit(ACTIONS.RELAY_SDP, {
                    peerID,
                    sessionDescription: answer,
                });
            }
        }

        socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia)

        return () => {
            socket.off(ACTIONS.SESSION_DESCRIPTION);
        }
    }, []);

    useEffect(() => {
        socket.on(ACTIONS.ICE_CANDIDATE, ({peerID, iceCandidate}) => {
            peerConnections.current[peerID]?.addIceCandidate(
                new RTCIceCandidate(iceCandidate)
            );
        });

        return () => {
            socket.off(ACTIONS.ICE_CANDIDATE);
        }
    }, []);

    useEffect(() => {
        const handleNewPeer = async({peerID, createOffer}) => {
            if (peerID in peerConnections.current) return console.warn(`Already connected to peer ${peerID}`);

            peerConnections.current[peerID] = new RTCPeerConnection({
                iceServers: freeice(),
            });

            peerConnections.current[peerID].onicecandidate = event => {
                if (event.candidate) {
                    socket.emit(ACTIONS.RELAY_ICE, {
                        peerID,
                        iceCandidate: event.candidate,
                    });
                }
            }

            peerConnections.current[peerID].ontrack = ({streams: [remoteStream]}) => {
                addNewClient(peerID, () => {
                    if (peerMediaElements.current[peerID]) {
                        peerMediaElements.current[peerID].srcObject = remoteStream;
                    } else {
                        let settled = false;

                        const interval = setInterval(() => {
                            if (peerMediaElements.current[peerID]) {
                                peerMediaElements.current[peerID].srcObject = remoteStream;
                                settled = true;
                            }

                            if (settled) {
                                clearInterval(interval);
                            }
                        }, 1000);
                    }
                });
            }

            localMediaStream.current.getTracks().forEach(track => {
                peerConnections.current[peerID].addTrack(track, localMediaStream.current);
            });

            if (createOffer) {
                const offer = await peerConnections.current[peerID].createOffer();

                await peerConnections.current[peerID].setLocalDescription(offer);

                socket.emit(ACTIONS.RELAY_SDP, {
                    peerID,
                    sessionDescription: offer,
                });
            }
        }

        socket.on(ACTIONS.ADD_PEER, handleNewPeer);

        return () => {
            socket.off(ACTIONS.ADD_PEER);
        }
    }, []);

    useEffect(() => {
        const handleRemovePeer = ({peerID}) => {
            if (peerConnections.current[peerID]) {
                peerConnections.current[peerID].close();
                delete peerConnections.current[peerID];
            }

            if (peerMediaElements.current[peerID]) {
                peerMediaElements.current[peerID].srcObject = null;
                delete peerMediaElements.current[peerID];
            }

            updateClients(list => list.filter(c => c !== peerID));
        };

        socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

        return () => {
            socket.off(ACTIONS.REMOVE_PEER);
        }
    }, []);

    const provideMediaRef = useCallback((id, node) => {
        if (node) {
            peerMediaElements.current[id] = node;
        }
    }, []);

    const toggleMute = (setIsMuted) => {
        setIsMuted(prev => !prev);
        if (localMediaStream.current) {
            localMediaStream.current.getTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
        }
    };

    return {
        clients,
        provideMediaRef,
        toggleMute
    };
}

export default useWebRTC;