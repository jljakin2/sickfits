import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });

  const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  });

  const successfulError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await reset().catch(console.error);

    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Reset your password</h2>
      <DisplayError error={successfulError || error} />
      <fieldset>
        {data?.redeemUserPasswordResetToken === null && (
          <p>Success! You can now sign in!</p>
        )}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Your email address"
          autoComplete="email"
          value={inputs.email}
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Your password"
          autoComplete="password"
          value={inputs.password}
          onChange={handleChange}
        />

        <button type="submit">Request Reset</button>
      </fieldset>
    </Form>
  );
}
