import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	'signup-with-email': async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();

		const email = formData.get('email')?.toString();

		function validateEmail(email) {
			var emailRegEx =
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return emailRegEx.test(String(email).toLowerCase());
		}

		const password = formData.get('password')?.toString();

		if (!email) {
			return fail(400, {
				error: 'Please enter your email'
			});
		}
		if (!password) {
			return fail(400, {
				error: 'Please enter a password',
				values: {
					email
				}
			});
		}

		if (!validateEmail(email)) {
			// Do something if the email is invalid
			return fail(400, {
				error: 'Invalid email address',
				values: {
					email
				}
			});
		}
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: url.origin }
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					error: 'Invalid credentials.',
					values: {
						email
					}
				});
			}

			return fail(500, {
				error: 'Error: ' + error.message,
				values: {
					email
				}
			});
		}

		return {
			message: 'Please check your email for a confirmation link.'
		};
	},

	'signup-with-oauth': async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const provider = formData.get('provider')?.toString();

		const {
			data: { url: oAuthUrl }
		} = await supabase.auth.signInWithOAuth({
			provider: provider,
			options: {
				redirectTo: `${url.origin}/api/auth/callback`
			}
		});

		if (!oAuthUrl) {
			return fail(500, {
				signinWithOAuth: {
					error: `Could not get provider url for ${provider}`
				}
			});
		}

		throw redirect(303, oAuthUrl);
	}
};
