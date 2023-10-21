import { AuthApiError } from '@supabase/supabase-js';
import { fail } from '@sveltejs/kit';

export const actions = {
	async default({ request, locals: { supabase } }) {
		const formData = await request.formData();
		console.log('Form Data Received:', Array.from(formData.entries())); // Log all form data

		const newPassword = formData.get('newPassword')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();
		const token = formData.get('token')?.toString(); // This is the reset token

		console.log(newPassword, confirmPassword);
		if (!newPassword || !confirmPassword) {
			return fail(400, {
				error: 'Both fields are required.'
			});
		}

		if (newPassword !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match.'
			});
		}

		// Updating password using supabase
		const { error } = await supabase.auth.updateUser({
			password: newPassword
		});

		if (error) {
			console.log(error);
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					error: 'Invalid token or credentials.'
				});
			}

			return fail(500, {
				error: 'Error: ' + error.message
			});
		}

		return {
			message: 'Password has been reset successfully.'
		};
	}
};
