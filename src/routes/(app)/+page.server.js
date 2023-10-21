import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	'signin-with-password': async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		function validateEmail(email) {
			var emailRegEx =
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return emailRegEx.test(String(email).toLowerCase());
		}

		if (!validateEmail(email)) {
			// Do something if the email is invalid
			return fail(400, {
				signinWithPassword: {
					error: 'Invalid email address',
					values: {
						email
					}
				}
			});
		}

		if (!email) {
			return fail(400, {
				signinWithPassword: {
					error: 'Please enter your email',
					values: {
						email
					}
				}
			});
		}

		if (!password) {
			return fail(400, {
				signinWithPassword: {
					error: 'Please enter your password',
					values: {
						email
					}
				}
			});
		}

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					signinWithPassword: {
						error: 'Invalid credentials.',
						values: {
							email
						}
					}
				});
			}
			return fail(500, {
				signinWithPassword: {
					error: 'Server error. Try again later.',
					values: {
						email
					}
				}
			});
		}

		throw redirect(303, '/dashboard');
	},

	'signin-with-oauth': async ({ request, url, locals: { supabase } }) => {
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
	},

	'create-magiclink': async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();

		function validateEmail(email) {
			var emailRegEx =
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return emailRegEx.test(String(email).toLowerCase());
		}

		if (!validateEmail(email)) {
			// Do something if the email is invalid
			return fail(400, {
				signinWithPassword: {
					error: 'Invalid email address',
					values: {
						email
					}
				}
			});
		}

		if (!email) {
			return fail(500, {
				createMagicLink: {
					error: 'Please enter your email'
				}
			});
		}

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${url.origin}/api/auth/callback`
			}
		});

		if (error) {
			return fail(500, {
				createMagicLink: {
					values: {
						email
					},
					error: 'Could not send magic link: ' + error.message
				}
			});
		}

		return {
			createMagicLink: {
				success: true
			}
		};
	},

	'send-reset-password-email': async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();

		function validateEmail(email) {
			var emailRegEx =
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return emailRegEx.test(String(email).toLowerCase());
		}

		if (!validateEmail(email)) {
			// Do something if the email is invalid
			return fail(400, {
				sendResetPasswordEmail: {
					error: 'Invalid email address',
					values: {
						email
					}
				}
			});
		}

		if (!email) {
			return fail(400, {
				sendResetPasswordEmail: {
					error: 'Please provide an email address'
				}
			});
		}

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${url.origin}/reset-password`
		});

		if (error) {
			return fail(500, {
				sendResetPasswordEmail: {
					error: 'Failed to send reset password email: ' + error.message
				}
			});
		}

		return {
			sendResetPasswordEmail: {
				success: true
			}
		};
	}
};
