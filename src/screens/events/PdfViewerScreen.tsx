import React from 'react';
import { Platform } from 'react-native';
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '../../store';

const PdfViewerScreen = () => {

    const eventState = useAppSelector(state => state.eventState);
    const rawPath = eventState?.pdfPath;

    const uri =
        Platform.OS === 'ios'
            ? rawPath?.startsWith('file://') ? rawPath : `file://${rawPath}`
            : rawPath?.startsWith('file://') ? rawPath : `file://${rawPath}`;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Pdf
                source={{ uri, cache: true }}
                style={{ flex: 1 }}
                onError={error => console.log('PDF error', error)}
            />
        </SafeAreaView>
    );
};

export default PdfViewerScreen;
