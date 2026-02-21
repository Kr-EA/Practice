import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { Repo } from '../../src/types';

interface ReposState {
  items: Repo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  username: string | null;
}

const initialState: ReposState = {
  items: [],
  status: 'idle',
  error: null,
  username: null,
};

export const fetchUserRepos = createAsyncThunk<Repo[], string>(
  'repos/fetchUserRepos',
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      if (!response.ok) {
        throw new Error('Error while loading user repos');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPopularRepos = createAsyncThunk<Repo[], void>(
  'repos/fetchPopularRepos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://api.github.com/search/repositories?q=stars:>5000&sort=stars&order=desc&per_page=40'
      );
      if (!response.ok) {
        throw new Error('Error while loading popular repos');
      }
      const data = await response.json();
      return data.items;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    clearRepos: (state) => {
      state.items = [];
      state.username = null;
    },
    setUsername: (state, action: PayloadAction<string | null>) => {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRepos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserRepos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUserRepos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchPopularRepos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPopularRepos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPopularRepos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearRepos, setUsername } = reposSlice.actions;
export default reposSlice.reducer;