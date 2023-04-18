"""empty message

Revision ID: 575a99a316c0
Revises: 8754fcfa7f30
Create Date: 2023-04-17 19:07:57.928093

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '575a99a316c0'
down_revision = '8754fcfa7f30'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('games', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('games', schema=None) as batch_op:
        batch_op.drop_column('image')

    # ### end Alembic commands ###
