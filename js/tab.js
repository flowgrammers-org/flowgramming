/*
 # *************************************************************************************
 # Copyright (C) 2021 Ritwik Murali, Harshit Agarwal, Rajkumar S, Gali Mary Sanjana
 # This file is part of Flowgramming <https://github.com/flowgrammers-org/flowgramming>.
 #
 # Flowgramming is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # Flowgramming is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with Flowgramming.  If not, see <http://www.gnu.org/licenses/>.
 # *************************************************************************************
 */

/**
 * Function to open given html file in a different tab
 * If it is open already, browser shifts focus automatically
 */

function openNewTab(html, target) {
    return window.open(html, target)
}

// This is to prevent the file to be opened independently
// which might cause inconsistency in the main function
// However, localhost is excluded for dev purposes.
preventIndependentOpen = () => {
    if (window.location.hostname !== 'localhost' && !window.opener) {
        window.location.href = '/'
    }
}
