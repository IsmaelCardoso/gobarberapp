import React, { useCallback, useRef } from "react"
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useNavigation } from "@react-navigation/native"
import * as Yup from "yup";
import { Form } from "@unform/mobile"
import { FormHandles } from "@unform/core"
import getValidationErrors from "../../utils/getValidationsErrors";

import api from "../../services/api"

import logoImg from "../../assets/logo.png"

import Input from '../../components/Input'
import Button from '../../components/Button'

import {
    Container,
    Title,
    BackToSignInButton,
    BackToSignInText
} from "./styles"

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const navigation = useNavigation();

    const handleSignUp = useCallback(async (data: SignUpFormData) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('Este campo é obrigatório'),
                email: Yup.string()
                    .required('Este campo é obrigatório')
                    .email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'Senha deve conter no mínimo 6 dígitos'),
            });

            await schema.validate(data, { abortEarly: false });
            
            console.log("data", data)
            await api.post('/users', data);

            Alert.alert(
                "Cadastro realizado com sucesso!",
                "Você já pode fazer login na aplicação.",
            );

            navigation.navigate("SignIn");
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);

                formRef.current?.setErrors(errors);


                return;
            }

            Alert.alert(
                'Erro no cadastro',
                'Ocorreu um erro ao fazer o cadastro, tente novamente.'
            );
        }
    }, [navigation]);

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                enabled
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flex: 1 }}
                >
                    <Container>
                        <Image source={logoImg} />
                        <View>
                            <Title>Crie sua conta</Title>
                        </View>

                        <Form ref={formRef} onSubmit={handleSignUp} style={{ width: '100%' }}>
                            <Input
                                name="name"
                                icon="user"
                                placeholder="Nome"
                                autoCapitalize="words"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    emailInputRef.current?.focus()
                                }}
                            />
                            <Input
                                ref={emailInputRef}
                                name="email"
                                icon="mail"
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoCapitalize="none"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus()
                                }}
                            />
                            <Input
                                ref={passwordInputRef}
                                name="password"
                                icon="lock"
                                placeholder="Senha"
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="send"
                                onSubmitEditing={() => {
                                    formRef.current?.submitForm()
                                }}
                            />

                            <Button onPress={() => {
                                formRef.current?.submitForm()
                            }}
                            >
                                Entrar
                            </Button>
                        </Form>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
            <BackToSignInButton onPress={() => { navigation.goBack() }}>
                <Icon name="arrow-left" size={20} color="#fff" />
                <BackToSignInText>Voltar para logon</BackToSignInText>
            </BackToSignInButton>
        </>
    )
}

export default SignUp