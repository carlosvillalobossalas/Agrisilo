import React from 'react'
import { Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';

interface CustomTextInputDialogProps {
    visible: boolean;
    value: string;
    errorMessaage: string;
    dialogTitle?: string;
    textInputLabel?: string;
    autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined
    onDismiss: () => void;
    onChangeText: (text: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
}

const CustomTextInputDialog = ({ visible, dialogTitle, textInputLabel, autoCapitalize = 'characters', errorMessaage, value, onChangeText, onCancel, onConfirm, onDismiss }: CustomTextInputDialogProps) => {
    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={onDismiss}
                style={{ backgroundColor: 'white' }}
            >
                <Dialog.Title>{dialogTitle}</Dialog.Title>

                <Dialog.Content>
                    <TextInput
                        label={textInputLabel}
                        mode="outlined"
                        value={value}
                        onChangeText={onChangeText}
                        autoCapitalize={autoCapitalize}
                    />

                    {errorMessaage ? (
                        <Text style={{ color: 'red', marginTop: 5 }}>{errorMessaage}</Text>
                    ) : null}
                </Dialog.Content>

                <Dialog.Actions>
                    <Button
                        onPress={onCancel}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onPress={onConfirm}
                    >
                        Confirmar
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default CustomTextInputDialog