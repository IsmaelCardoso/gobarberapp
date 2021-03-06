import React, { useCallback, useRef } from "react"
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useNavigation } from "@react-navigation/native"
import * as Yup from "yup";
import { Form } from "@unform/mobile"
import { FormHandles } from "@unform/core"

import { useAuth } from "../../hook/auth"

import getValidationErrors from "../../utils/getValidationsErrors";

import logoImg from "../../assets/logo.png"

import Input from '../../components/Input'
import Button from '../../components/Button'

import {
    Container,
    Title,
    ForgotPassword,
    ForgotPasswordText,
    CreateAccountButton,
    CreateAccountText
} from "./styles"

interface SignInFormData {
    email: string;
    password: string;
}

const SigIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const navigation = useNavigation();

    const { signIn } = useAuth();

    const handleSignIn = useCallback(
        async (data: SignInFormData) => {
            const { email, password } = data;
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('Este campo é obrigatório')
                        .email('Digite um e-mail válido'),
                    password: Yup.string().required('Digite sua senha'),
                });

                await schema.validate(data, { abortEarly: false });

                await signIn({ email, password });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);

                    formRef.current?.setErrors(errors);
                }

                Alert.alert(
                    'Erro na autenticação',
                    'Ocorreu um erro ao fazer o login, cheque as credenciais.'
                );
            }
        },
        [signIn],
    );

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
                            <Title>Faça seu logon</Title>
                        </View>

                        <Form ref={formRef} onSubmit={handleSignIn} style={{ width: '100%' }}>
                            <Input
                                name="email"
                                icon="mail"
                                placeholder="E-mail"
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                onSubmitEditing={() => { passwordInputRef.current?.focus() }}
                            />
                            <Input
                                ref={passwordInputRef}
                                name="password"
                                icon="lock"
                                placeholder="Senha"
                                secureTextEntry
                                returnKeyType="send"
                                onSubmitEditing={() => { formRef.current?.submitForm() }}
                            />

                            <Button onPress={() => { formRef.current?.submitForm() }}>Entrar</Button>
                        </Form>

                        <ForgotPassword onPress={() => { }}>
                            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
                        </ForgotPassword>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
            <CreateAccountButton onPress={() => { navigation.navigate("SignUp") }}>
                <Icon name="log-in" size={20} color="#ff9000" />
                <CreateAccountText>Criar uma conta</CreateAccountText>
            </CreateAccountButton>
        </>
    )
}

export default SigIn