'use server'

export async function requestAccountDeletion(email: string): Promise<{ success: boolean }> {
    if (!email) {
        throw new Error('Email is required');
    }

    try {
        // Send a request to the server to delete the account
        // const response = await fetch('/api/delete-account', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ email }),
        // });

        // if (!response.ok) {
        //     throw new Error('Account deletion failed');
        // }

        return { success: true };
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
}
