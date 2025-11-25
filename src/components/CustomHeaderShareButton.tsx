import React from 'react';
import { Share, Platform, TouchableOpacity } from 'react-native';
import { useAppSelector } from '../store';
import Icon from '@react-native-vector-icons/material-design-icons';

export const HeaderShareButton = () => {
    const pdfPath = useAppSelector(state => state.eventState.pdfPath);

    const uri =
        Platform.OS === 'ios'
            ? pdfPath?.startsWith('file://') ? pdfPath : `file://${pdfPath}`
            : pdfPath?.startsWith('file://') ? pdfPath : `file://${pdfPath}`;

    const handleShare = async () => {
        try {
            await Share.share({
                url: uri,
                title: 'Reporte de Eventos',
            });
        } catch (error) {
            console.log("Error al compartir PDF:", error);
        }
    };

    return (
        <TouchableOpacity
            onPress={handleShare}
            style={{
                backgroundColor: 'rgba(255,255,255,0.25)',
                padding: 5,
                borderRadius: 20,
            }}
        >
            <Icon name="share-variant" size={28} color="#000" />
        </TouchableOpacity>
    );
};
