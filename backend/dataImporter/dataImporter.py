import csv

input_file = "dataimporter/sampleInput.csv"
output_file = "dataimporter/sampleOutput.csv"
with open(input_file, "r") as csv_file:
    csv_reader = csv.reader(csv_file, dialect = "excel", delimiter = ",")
    line_count = 0
    data_list = []
    def get_block(room_string):
        return int(room_string[3])
    for row in csv_reader: 
        line_count += 1 
        if line_count == 1:
            continue # skips header row of input_file
        else:
            name, userID, email, room_num = row[2],  row[4], row[7], row[0] 
            # index of each col can be edited depending on format of file
            if (name == userID == email == room_num == ""):
                break
            defaultPasswordHash = "passwordHash" # can be changed into the default hashed password
            user_list = [name, userID, email, get_block(room_num), defaultPasswordHash, "", "", "", "", ""]
            data_list.append(user_list)
            # user_list contains: 
            # name, userID, email, block, default pwHash
            # empty string for:
            # bio, tele_handle, profilePicUrl, ccas, modules
with open(output_file, "w", newline='') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(["displayName", "userID", "email","block", "passwordHash", "bio", "telegramHandle", "profilePictureUrl", "ccas", "modules"])
    for i in range(len(data_list)):
        user = data_list[i]
        csv_writer.writerow(user)
    